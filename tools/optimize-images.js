#!/usr/bin/env node
/**
 * optimize-images.js
 *
 * Batch-converts and compresses images to WebP, mirroring the same settings
 * used for the website's photos in public/Assets/Media (maxWidthOrHeight: 1600, quality: 75%;
 * banners in Hero/ were done at 2000px). The admin dashboard's AddImageModal still uses quality 82%
 * for product/gallery uploads to Firebase.
 *
 * Usage:
 *   node optimize-images.js <input-folder> [output-folder]
 *
 * Examples:
 *   node optimize-images.js ../client/src/Public/Assets/Media/Gallery
 *   node optimize-images.js ./raw-photos ./optimized-photos
 *
 * If output-folder is omitted, a sibling folder named "<input-folder>-optimized"
 * is created automatically.
 *
 * Supported input formats: jpg, jpeg, png, webp, tiff, avif, gif, bmp
 *
 * Install dependency once:
 *   npm install   (inside the tools/ folder)
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// ─── Config (website photos; see header) ────────────────────────────────────
const CONFIG = {
  maxWidthOrHeight: 1600,
  quality: 75,           // 0–100 (approved after a visual before/after check, Nov 2026)
  outputFormat: "webp",
};

const SUPPORTED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".avif", ".gif", ".bmp",
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getAllImageFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath));
    } else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

function pad(str, len) {
  return str.length >= len ? str : str + " ".repeat(len - str.length);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node optimize-images.js <input-folder> [output-folder]");
    process.exit(1);
  }

  const inputDir = path.resolve(args[0]);
  if (!fs.existsSync(inputDir)) {
    console.error(`Error: Input folder not found: ${inputDir}`);
    process.exit(1);
  }

  const outputDir = args[1]
    ? path.resolve(args[1])
    : inputDir.replace(/\/?$/, "") + "-optimized";

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Image Optimizer");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Input  : ${inputDir}`);
  console.log(`  Output : ${outputDir}`);
  console.log(`  Format : ${CONFIG.outputFormat.toUpperCase()}`);
  console.log(`  Quality: ${CONFIG.quality}%   Max side: ${CONFIG.maxWidthOrHeight}px`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const files = getAllImageFiles(inputDir);
  if (files.length === 0) {
    console.log("No supported image files found.");
    process.exit(0);
  }

  console.log(`Found ${files.length} image(s). Processing...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const relativePath = path.relative(inputDir, filePath);
    const relativeDir = path.dirname(relativePath);
    const baseName = path.basename(filePath, path.extname(filePath));
    const outputFileName = `${baseName}.${CONFIG.outputFormat}`;
    const outputSubDir = path.join(outputDir, relativeDir);
    const outputFilePath = path.join(outputSubDir, outputFileName);

    fs.mkdirSync(outputSubDir, { recursive: true });

    try {
      const originalSize = fs.statSync(filePath).size;

      await sharp(filePath)
        .resize({
          width: CONFIG.maxWidthOrHeight,
          height: CONFIG.maxWidthOrHeight,
          fit: "inside",          // preserve aspect ratio, never upscale beyond box
          withoutEnlargement: true,
        })
        [CONFIG.outputFormat]({ quality: CONFIG.quality })
        .toFile(outputFilePath);

      const optimizedSize = fs.statSync(outputFilePath).size;
      const saving = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      totalOriginal += originalSize;
      totalOptimized += optimizedSize;
      successCount++;

      const prefix = `  [${String(i + 1).padStart(String(files.length).length)}/${files.length}]`;
      const label = pad(relativePath, 45);
      console.log(
        `${prefix} ${label}  ${pad(formatBytes(originalSize), 10)} → ${pad(formatBytes(optimizedSize), 10)}  (${saving}% saved)`
      );
    } catch (err) {
      errorCount++;
      console.error(`  [ERROR] ${relativePath}: ${err.message}`);
    }
  }

  const totalSaving = totalOriginal > 0
    ? ((1 - totalOptimized / totalOriginal) * 100).toFixed(1)
    : "0.0";

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Done!  ${successCount} optimized, ${errorCount} failed`);
  console.log(`  Total  : ${formatBytes(totalOriginal)} → ${formatBytes(totalOptimized)}  (${totalSaving}% saved)`);
  console.log(`  Output : ${outputDir}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
