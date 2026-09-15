import { getProducts } from "@/services/productService";
import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { HandmadeSection } from "@/components/home/HandmadeSection";
import { CustomizedBangles } from "@/components/home/CustomizedBangles";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { MandalaDivider } from "@/components/ui/MandalaDivider";
import { getInstagramPosts } from "@/services/instagramPostService";

// This is a Server Component: product data is fetched through the service
// layer, so newly published arrivals appear automatically on the next load.
export default async function HomePage() {
  const newArrivals = await getProducts({ newArrival: true });
  const instagramPosts = await getInstagramPosts();

  return (
    <div className="space-y-20 py-10">
      <Hero />

      <ProductSection
        title="New Arrivals"
        subtitle="Freshly handcrafted, just added to the collection."
        products={newArrivals.slice(0, 8)}
        viewAllHref="/shop?filter=newArrival"
      />

      <MandalaDivider />

      <HandmadeSection />

      <CustomizedBangles />

      <InstagramGallery posts={instagramPosts} />
    </div>
  );
}
