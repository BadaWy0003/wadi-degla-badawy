'use client';

// Pop-up messages (react-toastify). Loaded by AppShell only when a message must be shown,
// so pages don't download it (and its CSS) on every visit. Toasts sent before this mounts
// are queued by react-toastify and shown as soon as it does.
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastHost() {
  return <ToastContainer autoClose={5000} hideProgressBar />;
}
