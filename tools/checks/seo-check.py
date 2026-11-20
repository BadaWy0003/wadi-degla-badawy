#!/usr/bin/env python3
"""
SEO and link check of the BUILT website (client-next/out/, after `npm run build`).

Every page is read from disk (nothing is fetched, so it's free and fast):
  - internal links and photos point to files that exist (srcset copies included)
  - every indexable page has a title (≤ 65 characters), a description (≤ 160),
    a canonical address pointing to itself and exactly one H1
  - no two indexable pages of the same language share a title or description
  - every <img> has an alt attribute
  - every sitemap.xml address exists and isn't "noindex", and every indexable page is
    in the sitemap; hreflang links point to pages that exist
It also writes the list of outside links (Firebase photos, WhatsApp...) to a JSON file,
so they can be checked with curl where the network allows it.

Usage (from the repository root):
  python3 -I tools/checks/seo-check.py [path/to/out] [external-links.json]
Exit code 1 when something is found. The bare "/" page is skipped: nginx redirects it
to /en/ (it's never served).
"""
import collections
import html
import json
import os
import re
import sys
from html.parser import HTMLParser
from urllib.parse import unquote

OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else 'client-next/out')
EXTERNAL_JSON = sys.argv[2] if len(sys.argv) > 2 else None
BASE = 'https://www.wadidegla-eg.com'
SKIP = {'/'}  # redirect page, never served


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.in_title = False
        self.meta = {}
        self.links = []
        self.canon = None
        self.alts = []
        self.imgs = []
        self.h1 = 0
        self.noalt = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title':
            self.in_title = True
            self.title = ''
        elif tag == 'meta' and a.get('name'):
            self.meta[a['name']] = a.get('content', '')
        elif tag == 'link' and a.get('rel') == 'canonical':
            self.canon = a.get('href')
        elif tag == 'link' and a.get('rel') == 'alternate' and a.get('hreflang'):
            self.alts.append(a.get('href'))
        elif tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        elif tag == 'img':
            if a.get('src'):
                self.imgs.append(a['src'])
            for part in (a.get('srcset') or '').split(','):
                if part.strip():
                    self.imgs.append(part.strip().split()[0])
            if 'alt' not in a:
                self.noalt += 1
        elif tag == 'h1':
            self.h1 += 1

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def exists(path):
    p = path.split('#')[0].split('?')[0]
    if not p.startswith('/') or p.startswith('//'):
        return True
    p = unquote(html.unescape(p))
    f = OUT + p
    if p.endswith('/'):
        return os.path.exists(f + 'index.html')
    return os.path.exists(f) or os.path.exists(f + '/index.html') or os.path.exists(f + '.html')


def main():
    if not os.path.isdir(OUT):
        sys.exit(f'No build found at {OUT}: run `npm run build` in client-next first.')
    pages = {}
    for root, _, files in os.walk(OUT):
        if 'index.html' in files:
            rel = root[len(OUT):] + '/'
            if rel.startswith('/_next') or rel in SKIP:
                continue
            p = Page()
            p.feed(open(os.path.join(root, 'index.html'), encoding='utf-8').read())
            pages[rel] = p

    issues = collections.defaultdict(list)
    external = set()
    noindex = lambda p: 'noindex' in p.meta.get('robots', '')
    for rel, p in pages.items():
        if not (p.title or '').strip():
            issues['missing title'].append(rel)
        elif not noindex(p) and len(p.title) > 65:
            issues['title over 65 characters'].append(f'{rel} ({len(p.title)}) {p.title[:70]}')
        if not noindex(p):
            d = p.meta.get('description')
            if not d:
                issues['missing description'].append(rel)
            elif len(d) > 160:
                issues['description over 160 characters'].append(f'{rel} ({len(d)})')
            if not p.canon:
                issues['missing canonical'].append(rel)
            elif p.canon != BASE + rel:
                issues['canonical is not this page'].append(f'{rel} -> {p.canon}')
            if p.h1 != 1:
                issues['not exactly one H1'].append(f'{rel} ({p.h1})')
        if p.noalt:
            issues['images without alt'].append(f'{rel} ({p.noalt})')
        for link in p.links:
            if link.startswith(BASE):
                link = link[len(BASE):]
            elif link.startswith('http'):
                external.add(link)
                continue
            if not exists(link):
                issues['broken internal link'].append(f'{rel} -> {link}')
        for img in p.imgs:
            if img.startswith('http'):
                external.add(img)
            elif not img.startswith('data:') and not exists(img):
                issues['missing image'].append(f'{rel} -> {img}')
        for alt in p.alts:
            if alt and alt.startswith(BASE) and not exists(alt[len(BASE):]):
                issues['hreflang to a missing page'].append(f'{rel} -> {alt}')

    by_lang = collections.defaultdict(lambda: collections.defaultdict(list))
    for rel, p in pages.items():
        if noindex(p):
            continue
        lang = rel.split('/')[1]
        by_lang[lang]['title\0' + (p.title or '')].append(rel)
        by_lang[lang]['description\0' + (p.meta.get('description') or '')].append(rel)
    for lang, groups in by_lang.items():
        for key, rels in groups.items():
            kind, text = key.split('\0', 1)
            if len(rels) > 1 and text:
                issues[f'duplicate {kind}'].append(f'{lang}: {len(rels)} pages share "{text[:60]}" e.g. {rels[:3]}')

    sitemap = open(os.path.join(OUT, 'sitemap.xml'), encoding='utf-8').read()
    locs = re.findall(r'<loc>([^<]+)</loc>', sitemap)
    for url in locs:
        rel = url[len(BASE):]
        if not exists(rel):
            issues['sitemap address missing'].append(url)
        elif rel in pages and noindex(pages[rel]):
            issues['sitemap address is noindex'].append(url)
    in_sitemap = {u[len(BASE):] for u in locs}
    for rel, p in pages.items():
        if not noindex(p) and rel not in in_sitemap and rel.count('/') > 1:
            issues['indexable page not in the sitemap'].append(rel)

    print(f'{len(pages)} pages, {len(locs)} sitemap addresses, {len(external)} outside links')
    for name, found in sorted(issues.items()):
        print(f'\n## {name}: {len(found)}')
        for line in sorted(set(found))[:15]:
            print('  ', line)
    if EXTERNAL_JSON:
        json.dump(sorted(external), open(EXTERNAL_JSON, 'w'))
        print(f'\nOutside links written to {EXTERNAL_JSON}')
    print('\nRESULT:', 'problems found' if issues else 'all good')
    sys.exit(1 if issues else 0)


if __name__ == '__main__':
    main()
