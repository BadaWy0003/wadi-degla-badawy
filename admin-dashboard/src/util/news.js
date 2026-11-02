import imageCompression from 'browser-image-compression';
import apiClient from './client';

// The live website: existing article photos are stored as /Assets/Media/... paths of the website.
export const SITE_URL = 'https://www.wadidegla-eg.com';

// News can be managed by ADMIN and SUPER_ADMIN only (server enforces the same rule).
export const canManageNews = role => role === 'ADMIN' || role === 'SUPER_ADMIN';

export const photoUrl = src => (src && src.startsWith('/') ? `${SITE_URL}${src}` : src || '');

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Same display as the website: "June 2025".
export const formatDate = (year, month) => (year && month ? `${MONTHS[month - 1]} ${year}` : '');

export const articleUrl = slug => `${SITE_URL}/en/news/${slug}/`;

// Paragraphs are separated by an empty line (same rule as the website).
export const toParagraphs = text =>
  String(text || '')
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(Boolean);

// Compress in the browser (WebP, max 1600px, like the website photos), then upload in
// batches of 15 (server limit). Returns the public links in the same order.
export const uploadNewsPhotos = async (files, onProgress) => {
  const links = [];
  const list = [...files];
  for (let i = 0; i < list.length; i += 15) {
    const batch = list.slice(i, i + 15);
    const compressed = await Promise.all(
      batch.map(f => imageCompression(f, { maxWidthOrHeight: 1600, initialQuality: 0.8, useWebWorker: true, fileType: 'image/webp' })),
    );
    const form = new FormData();
    compressed.forEach((blob, k) => form.append('files', blob, batch[k].name.replace(/\.[^.]+$/, '') + '.webp'));
    const { data } = await apiClient.post('/api/news/admin/photos', form);
    links.push(...data.data);
    if (onProgress) onProgress(Math.min(i + 15, list.length), list.length);
  }
  return links;
};
