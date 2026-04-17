import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  let retailersPretty = product.retailers;
  try {
    retailersPretty = JSON.stringify(JSON.parse(product.retailers), null, 2);
  } catch {
    /* keep raw */
  }

  return (
    <div>
      <Link href="/admin/products" className="text-sm font-bold text-brand hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Edit product</h1>
      <p className="mt-1 font-mono text-xs text-muted">{product.id}</p>
      <div className="mt-8 max-w-2xl">
        <ProductForm
          mode="edit"
          productId={product.id}
          initial={{
            name: product.name,
            slug: product.slug,
            blurb: product.blurb,
            price: product.price,
            tag: product.tag,
            imageUrl: product.imageUrl ?? "",
            sortOrder: product.sortOrder,
            retailersJson: retailersPretty,
          }}
        />
      </div>
    </div>
  );
}
