import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lucky-lightNeutral text-xs font-semibold text-lucky-mutedText mb-6 border border-lucky-borderLight">
        <span>B2B Apparel Manufacturing</span>
      </div>
      <h1 className="text-4xl sm:text-6xl font-bold mb-4 font-heading">
        Engineered Quality Apparel for Growing Brands
      </h1>
      <p className="text-lg text-lucky-mutedText mb-8 max-w-2xl">
        Lucky Fashion specializes in premium corporate wear, t-shirts, polo shirts, workwear, and customized bulk garment manufacturing.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/quote"
          className="px-6 py-3 rounded-lg bg-lucky-blue text-white font-medium hover:bg-blue-700 transition"
        >
          Request a Quote
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 rounded-lg bg-white border border-lucky-borderLight text-lucky-dark font-medium hover:bg-slate-50 transition"
        >
          Explore Catalog
        </Link>
      </div>
    </main>
  );
}

