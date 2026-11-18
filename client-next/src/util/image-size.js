// Build time only (server side): the real size of a photo in public/ (WebP, PNG or JPEG),
// read from the file's first bytes. Used to give the admin panel the website's own photos
// as { src, width, height } (photo lists in the "Website" menu need the size).
import fs from 'fs';
import path from 'path';

const PUBLIC = path.join(process.cwd(), 'public');

function sizeOfBuffer(b) {
  // WebP: RIFF....WEBP + VP8 / VP8L / VP8X chunk
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16);
    if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  }
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // JPEG: walk the markers to the first SOFn
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

// '/Assets/Media/x.webp' -> { src, width, height } (1600 x 1200 when it can't be read)
export function photoWithSize(src) {
  try {
    const fd = fs.openSync(path.join(PUBLIC, src), 'r');
    const b = Buffer.alloc(65536);
    fs.readSync(fd, b, 0, b.length, 0);
    fs.closeSync(fd);
    const s = sizeOfBuffer(b);
    if (s && s.width > 0 && s.height > 0) return { src, ...s };
  } catch {
    // missing file: fall through
  }
  return { src, width: 1600, height: 1200 };
}
