"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Return from "@/images/return-policy.png";
import Shipping from "@/images/shipping.png";
import Warranty from "@/images/warranty.png";
import StarRating from "@/components/starRating/page";
import { MdAddShoppingCart } from "react-icons/md";
import LoadingSpinner from "@/components/loadingSpinner/page";
import Navbar from "@/components/navbar/page";
import { useCart } from "@/context/Cart/page";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Auth/page";
import Link from "next/link";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const [orderCount, setOrderCount] = useState(1);
  const [toggleReview, setToggleReview] = useState(true);
  const router = useRouter();
  const { currentUser } = useAuth();
  const [forceUser, setForceUser] = useState(false);

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
    if (orderCount < product.stock) setOrderCount(orderCount + 1);
  };

  const decrement = () => {
    if (orderCount >= 2) {
      setOrderCount(orderCount - 1);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <LoadingSpinner />;
  }

  const description = () => {
    setToggleReview(true);
  };

  const review = () => {
    setToggleReview(false);
  };

  // const addItemToCart = () => {
  //   setCartState(cartState + 1);
  // };

  const date = new Date(product.reviews[0].date);
  const reviewDate = date.toISOString().slice(0, 10);

  return (
    <div>
      <Navbar />
      <div className="font-serif m-2 sm:mx-20 mt-20">
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
              <p className="text-slate-500">
                ({product.reviews.length} reviews)
              </p>
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
              <div>
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
                <p className="text-xs my-1">Available: {product.stock}</p>
              </div>
            </div>
            <hr className="w-full" />
            <div className="flex items-center mx-auto sm:mx-1 gap-2">
              <button
                onClick={() => {
                  if (currentUser) {
                    addToCart(product);
                  } else {
                    setForceUser(true);
                  }
                }}
                className="mt-5 border border-yellow-400 bg-yellow-400 flex items-center gap-2 rounded-xl text-xs p-2 px-5 font-semibold"
              >
                <MdAddShoppingCart size={25} />
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  router.push("/cart");
                }}
                className="mt-5 border border-green-500 rounded-xl p-2 px-9 text-sm font-semibold bg-green-500 text-white"
              >
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
            <Image
              src={Warranty}
              alt="warranty"
              width={150}
              height={150}
              className="bg-green-50 rounded-full p-2"
            />
            <p className="text-xl">{product.warrantyInformation}</p>
          </div>
          <div className="flex flex-col items-center justify-between">
            <Image
              src={Shipping}
              alt="shipping"
              width={150}
              height={150}
              className="bg-green-50 rounded-full p-2"
            />
            <p className="text-xl">{product.shippingInformation}</p>
          </div>
          <div className="flex flex-col items-center justify-between">
            <Image
              src={Return}
              alt="return"
              width={150}
              height={150}
              className="bg-green-50 rounded-full p-2"
            />
            <p className="text-xl">{product.returnPolicy}</p>
          </div>
        </div>
        <div className="mb-10">
          <div className="flex gap-3">
            <p
              onClick={description}
              className={`${
                toggleReview ? "border-b-green-500 border-b-4" : ""
              } cursor-pointer`}
            >
              Description
            </p>
            <p
              onClick={review}
              className={`${
                !toggleReview ? "border-b-green-500 border-b-4" : ""
              } cursor-pointer`}
            >
              Reviews ({product.reviews.length})
            </p>
          </div>
          <div>
            <div className={`${toggleReview ? "" : "hidden"}`}>
              <p className="my-5">{product.description}</p>
            </div>
            <div className={`${!toggleReview ? "" : "hidden"} my-8`}>
              {product.reviews.map((review) => (
                <div key={review.id} className="sm:flex sm:gap-20 my-5">
                  <div className="sm:w-40">
                    <p>{review.reviewerName}</p>
                    <p>{reviewDate}</p>
                  </div>
                  <div>
                    <div className="bg-green-50 w-20 p-1 rounded-md">
                      <StarRating rating={review.rating} />
                    </div>
                    <p>{review.comment}</p>
                    <p className="text-sm">Was this review helpful?</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 ${
          forceUser ? "" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg text-center p-3 mx-5 sm:mx-1 sm:py-5">
          <div className="text-sm">
            <p>User is not logged in!!!</p>
            <p>
              To continue shopping, login to your account or create an account
              by clicking the signup button
            </p>
          </div>
          <div className="flex gap-3 items-center justify-center mt-4">
            <Link href={"/signup"}>
              <button className="border border-green-500 rounded-md px-3 py-1 text-green-500">
                Sign Up
              </button>
            </Link>
            <Link href={"/login"}>
              <button className="bg-green-500 rounded-md px-4 py-1 text-white">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
