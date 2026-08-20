import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// slugify — used for URL fallbacks when a record has no slug
export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// friendly ISO date → e.g. "Aug 20, 2026"
export function formatDate(input) {
  if (!input) return '';
  try {
    return new Date(input).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(input);
  }
}

// used by legacy `createPageUrl` callers
export function createPageUrl(name = '') {
  return '/' + String(name).replace(/\s+/g, '-').toLowerCase();
}
