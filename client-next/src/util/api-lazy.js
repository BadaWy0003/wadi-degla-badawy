'use client';

// The API client (axios + qs, ~32 KB gzipped) is only downloaded when a call is really made.
// Use these in components that are on every page (header, search, login state), so pages that
// never call the API don't download it. Pages that load data anyway can import client.js directly.

export const getApiClient = () => import('./client.js').then((m) => m.default);

// Product list for the search boxes: fetched once, the first time a search box is opened,
// and shared by the desktop and phone search boxes.
let searchProducts = null;
export function loadSearchProducts() {
  if (!searchProducts) {
    searchProducts = getApiClient()
      .then((api) => api.get('/api/storage/all'))
      .then(({ data }) => data.data || [])
      .catch((error) => {
        console.error('Error fetching products:', error);
        searchProducts = null; // try again next time
        return [];
      });
  }
  return searchProducts;
}
