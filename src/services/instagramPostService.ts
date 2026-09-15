import { prisma } from "@/lib/prisma";
import type { z } from "zod";
import type { instagramPostsSchema } from "@/lib/validations";

export const DEFAULT_INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/DdRQx04k5W7/",
  "https://www.instagram.com/p/DcfP_KZk1OT/",
  "https://www.instagram.com/p/DcPvwaTTzgd/",
  "https://www.instagram.com/p/DcBOVhsk9yV/",
  "https://www.instagram.com/p/DcTjQstkyhs/"
] as const;

export type InstagramPostsInput = z.infer<typeof instagramPostsSchema>;

function settingsToPosts(settings: InstagramPostsInput) {
  return [settings.post1, settings.post2, settings.post3, settings.post4, settings.post5];
}

export async function getInstagramPosts() {
  const settings = await prisma.instagramPostSettings.findUnique({ where: { id: 1 } });
  return settings ? settingsToPosts(settings) : [...DEFAULT_INSTAGRAM_POSTS];
}

export function getInstagramPostsFormValues() {
  return prisma.instagramPostSettings.findUnique({ where: { id: 1 } }).then((settings) => settings ?? {
    id: 1,
    post1: DEFAULT_INSTAGRAM_POSTS[0],
    post2: DEFAULT_INSTAGRAM_POSTS[1],
    post3: DEFAULT_INSTAGRAM_POSTS[2],
    post4: DEFAULT_INSTAGRAM_POSTS[3],
    post5: DEFAULT_INSTAGRAM_POSTS[4]
  });
}

export function saveInstagramPosts(posts: InstagramPostsInput) {
  return prisma.instagramPostSettings.upsert({
    where: { id: 1 },
    update: posts,
    create: { id: 1, ...posts }
  });
}
