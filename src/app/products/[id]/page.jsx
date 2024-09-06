"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${params.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (e) {
        console.error("An error occurred while fetching the product:", e);
        setError(e.message);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-serif m-5">
      <h1 className="text-3xl mb-5">{product.title}</h1>
      <div className="flex flex-col items-center md:flex-row gap-10">
        <Image
          src={product.images[0]}
          alt="image"
          width={300}
          height={300}
          className="bg-slate-100 rounded-xl"
        />
        <div className="flex flex-col items-start">
          <p className="text-xl font-bold">
            &#8358;{Math.ceil(product.price * 1500).toLocaleString()}
          </p>
          <p className="line-through">
            &#8358;
            {Math.ceil(
              product.price * 1500 +
                product.price * 1500 * (product.discountPercentage / 100)
            ).toLocaleString()}
          </p>
          <p className="text-red-600 bg-red-100 text-sm p-1 rounded-md">
            -{product.discountPercentage}%
          </p>
          <p className="mt-4">{product.description}</p>
          <button className="mt-5 border border-slate-950 rounded-xl p-2 font-semibold group-hover:bg-black group-hover:text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
