import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

const defaultRetailers = `{
  "amazon": "https://www.amazon.in/",
  "flipkart": "https://www.flipkart.com/",
  "instamart": "https://www.swiggy.com/instamart",
  "blinkit": "https://blinkit.com/",
  "zepto": "https://www.zepto.in/"
}`;

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm font-bold text-brand hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">New product</h1>
      <p className="mt-1 text-sm font-medium text-muted">
        Retailer keys must be valid JSON and match the storefront (e.g. amazon, flipkart, blinkit).
      </p>
      <div className="mt-8 max-w-2xl">
        <ProductForm mode="create" defaultRetailersJson={defaultRetailers} />
      </div>
    </div>
  );
}
