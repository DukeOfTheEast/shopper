"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Return from "@/images/return-policy.png";
import Shipping from "@/images/shipping.png";
import Warranty from "@/images/warranty.png";
import StarRating from "@/components/starRating/page";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const [orderCount, setOrderCount] = useState(1);
  const [toggleReview, setToggleReview] = useState(true);

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

  const increment = () => {
    setOrderCount(orderCount + 1);
  };

  const decrement = () => {
    setOrderCount(orderCount - 1);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const description = () => {
    setToggleReview(true);
  };

  const review = () => {
    setToggleReview(false);
  };

  return (
    <div className="font-serif m-2 sm:mx-20">
      <div className="flex flex-col items-center md:flex-row gap-10 mt-10">
        <Image
          src={product.images[0]}
          alt="image"
          width={300}
          height={300}
          className="bg-slate-100 rounded-xl sm:w-96 sm:h-96"
        />
        <div className="flex flex-col items-start">
          <h1 className="text-3xl mb-5">{product.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <p>({product.reviews.length} reviews)</p>
          </div>
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
          <div className="flex flex-row items-center mx-auto sm:mx-1 justify-between gap-x-40 my-3">
            <p>Quantity</p>
            <div className=" border border-black rounded-md px-1">
              <button className="text-xl" onClick={decrement}>
                -
              </button>
              <input
                type="number"
                value={orderCount}
                className="w-10 text-center border-none focus:outline-none"
                readOnly
              />
              <button className="text-xl" onClick={increment}>
                +
              </button>
            </div>
          </div>
          <hr className="w-full" />
          <div className="flex items-center mx-auto sm:mx-1 gap-2">
            <button className="mt-5 border border-slate-950 rounded-xl p-2 px-5 font-semibold">
              Add to Cart
            </button>
            <button className="mt-5 border border-slate-950 rounded-xl p-2 px-9 font-semibold bg-slate-800 text-white">
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
      <div>
        <div className="flex gap-3">
          <p
            onClick={description}
            className={`${
              toggleReview ? "border-b-amber-950 border-b-4" : ""
            } cursor-pointer`}
          >
            Description
          </p>
          <p
            onClick={review}
            className={`${
              !toggleReview ? "border-b-amber-950 border-b-4" : ""
            } cursor-pointer`}
          >
            Reviews
          </p>
        </div>
        <div>
          <div className={`${toggleReview ? "" : "hidden"}`}>
            <p>Big descriptions</p>
          </div>
          <div className={`${!toggleReview ? "" : "hidden"}`}>
            <p>My big reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
