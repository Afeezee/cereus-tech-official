// Legacy helper kept for pages that still import it.
// Newer code should use createPageUrl from '@/lib/utils'.
export function createPageUrl(pageName: string) {
  return '/' + pageName.replace(/ /g, '-').toLowerCase();
}
