//src/page.tsx
import Hero from "@/components/HomePage/hero";
import Categories from "@/components/HomePage/categories";
import BestSellers from "@/components/HomePage/best-sellers";
import AboutUs from "@/components/HomePage/about-us";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <BestSellers />
      <AboutUs />
    </main>
  );
}
