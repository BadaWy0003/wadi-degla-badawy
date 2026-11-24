// Readable names for the admin roles stored on the server (MODERATOR, ADMIN, SUPER_ADMIN).
export const ROLE_LABELS = { SUPER_ADMIN: 'Owner', ADMIN: 'Admin', MODERATOR: 'Editor' };
export const roleLabel = role => ROLE_LABELS[role] || role || '';
