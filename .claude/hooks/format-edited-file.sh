#!/usr/bin/env bash
# PostToolUse hook: run Prettier on the single file Claude just edited.
# Only formats files inside an app that has Prettier installed; never fails the edit.
file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write((j.tool_input&&j.tool_input.file_path)||"")}catch{}})')
[ -z "$file" ] && exit 0
case "$file" in *.js|*.jsx|*.css|*.json|*.md) ;; *) exit 0 ;; esac
root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
for app in client-next server admin-dashboard; do
  case "$file" in
    "$root/$app/"*)
      bin="$root/$app/node_modules/.bin/prettier"
      [ -x "$bin" ] && (cd "$root/$app" && "$bin" --write --log-level silent "$file") || true
      ;;
  esac
done
exit 0
