"use client";

import Image from "next/image";
import React from "react";
import Checkout from "@/images/cart-checkout.png";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CheckoutSuccess = () => {
  return (
    <div className="flex flex-col items-center text-center h-full sm:h-screen py-10 bg-gradient-to-r from-green-100 via-white to-green-100">
      <p className="font-bold">Thank you for your purchase!</p>
      <Image src={Checkout} alt="checkout" width={300} height={300} />
      <p>Thanks for placing an order:</p>
      <p className="my-3 mx-3">
        We will send you a notification within 5 days when it ships.
      </p>

      <p>All the Best</p>
      <div className="flex sm:flex-row flex-col-reverse gap-3 my-8 w-[300px] sm:w-auto">
        <Link href={"/products"}>
          <button className="flex items-center justify-center gap-1 rounded-md py-1 px-3 border border-green-500 font-serif w-full sm:w-auto">
            <ArrowLeft size={15} />
            <p>Continue Shopping</p>
          </button>
        </Link>
        <button className="rounded-md py-1 px-3 bg-green-500 text-white w-full sm:w-auto">
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
