import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Trigger Next.js on-demand ISR revalidation across public routes.
 */
export function revalidatePublicContent(path?: string, tag?: string) {
  if (path) {
    revalidatePath(path);
  }
  if (tag) {
    revalidateTag(tag);
  }
}

