import { SITE_URL, uploadSitePhotos } from './news';

// Projects can be managed by ADMIN and SUPER_ADMIN only (server enforces the same rule).
export { canManageNews as canManageProjects, photoUrl } from './news';

export const projectUrl = id => `${SITE_URL}/en/projects/${id}/`;

export const uploadProjectPhotos = (files, onProgress) => uploadSitePhotos('/api/projects/admin/photos', files, onProgress);

// "Nairobi - Kenya", like the website.
export const locationText = (city, country) => [city, country].filter(Boolean).join(' - ');
