import { getProducts } from "@/services/productService";
import { Hero } from "@/components/home/Hero";
import { ProductSection } from "@/components/home/ProductSection";
import { HandmadeSection } from "@/components/home/HandmadeSection";
import { CustomizedBangles } from "@/components/home/CustomizedBangles";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { MandalaDivider } from "@/components/ui/MandalaDivider";

// This is a Server Component: all product data is fetched here from the
// database via the service layer, never hardcoded. When the admin publishes
// a new product marked "New Arrival", "Bestseller", or "Featured", it will
// appear here automatically on next page load — no code changes required.
export default async function HomePage() {
  const [newArrivals, bestsellers, featured] = await Promise.all([
    getProducts({ newArrival: true }),
    getProducts({ bestseller: true }),
    getProducts({ featured: true })
  ]);

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

      <ProductSection
        title="Best Sellers"
        subtitle="Loved again and again by our customers."
        products={bestsellers.slice(0, 8)}
        viewAllHref="/shop?filter=bestseller"
      />

      <MandalaDivider />

      <ProductSection
        title="Featured Collection"
        subtitle="Curated pieces, handpicked for the season."
        products={featured.slice(0, 8)}
        viewAllHref="/shop?filter=featured"
      />

      <MandalaDivider />

      <HandmadeSection />

      <CustomizedBangles />

      <InstagramGallery />
    </div>
  );
}
