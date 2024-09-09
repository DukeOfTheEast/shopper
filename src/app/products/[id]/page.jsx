"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Return from "@/images/return-policy.png";
import Shipping from "@/images/shipping.png";
import Warranty from "@/images/warranty.png";

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
    <div className="font-serif m-2 sm:mx-20">
      <h1 className="text-3xl mb-5">{product.title}</h1>
      <div className="flex flex-col items-center md:flex-row gap-10">
        <Image
          src={product.images[0]}
          alt="image"
          width={300}
          height={300}
          className="bg-slate-100 rounded-xl sm:w-96 sm:h-96"
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
          <div className="mt-3">
            <h1 className="font-bold">Description</h1>
            <p className="">{product.description}</p>
          </div>
          <div className="flex gap-2">
            <button className="mt-5 border border-slate-950 rounded-xl p-2 font-semibold">
              Add to Cart
            </button>
            <button className="mt-5 border border-slate-950 rounded-xl p-2 font-semibold bg-slate-800 text-white">
              Buy Now
            </button>
          </div>
          <div className="flex items-center justify-center">
            <span className="mx-1 bg-lime-100 rounded px-1">tags</span>
            <ul className="flex gap-1 my-2">
              {product.tags.map((tag) => (
                <li key={tag} className="">
                  <p>#{tag}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between my-20 sm:mx-14 font-bold gap-14">
        <div className="flex flex-col items-center justify-between">
          <Image src={Warranty} alt="warranty" width={150} height={150} />
          <p className="text-xl">{product.warrantyInformation}</p>
        </div>
        <div className="flex flex-col items-center justify-between">
          <Image src={Shipping} alt="shipping" width={150} height={150} />
          <p className="text-xl">{product.shippingInformation}</p>
        </div>
        <div className="flex flex-col items-center justify-between">
          <Image src={Return} alt="return" width={150} height={150} />
          <p className="text-xl">{product.returnPolicy}</p>
        </div>
      </div>
    </div>
  );
}
