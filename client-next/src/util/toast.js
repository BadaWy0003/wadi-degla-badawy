'use client';

// Pop-up messages without loading react-toastify on every page: getToast() asks AppShell to
// mount the toast container (see ToastHost.js) and returns react-toastify's toast().
export const SHOW_TOASTS_EVENT = 'wd-show-toasts';

export async function getToast() {
  window.dispatchEvent(new Event(SHOW_TOASTS_EVENT));
  const { toast } = await import('react-toastify');
  return toast;
}
