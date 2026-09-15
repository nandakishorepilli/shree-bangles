import { InstagramPostsForm } from "@/components/admin/InstagramPostsForm";
import { getInstagramPostsFormValues } from "@/services/instagramPostService";

export default async function InstagramPostsPage() {
  const { post1, post2, post3, post4, post5 } = await getInstagramPostsFormValues();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-blush-900">Instagram Posts</h1>
      <InstagramPostsForm initialPosts={{ post1, post2, post3, post4, post5 }} />
    </div>
  );
}
