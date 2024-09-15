"use client";

import Image from "next/image";
import React from "react";
import Checkout from "@/images/cart-checkout.png";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CheckoutSuccess = () => {
  return (
    <div className="flex flex-col items-center text-center h-screen py-10 bg-gradient-to-r from-green-100 via-white to-green-100">
      <p className="font-bold">Thank you for your purchase!</p>
      <Image src={Checkout} alt="checkout" width={300} height={300} />
      <p>Thanks for placing an order:</p>
      <p className="my-3 mx-3">
        We will send you a notification within 5 days when it ships.
      </p>
      <p className="mx-3">
        {" "}
        If you have any questions or queries, please do not fail to contact us.
      </p>
      <p>All the Best</p>
      <div className="flex gap-3 my-8">
        <Link href={"/products"}>
          <button className="flex items-center gap-1 rounded-md py-1 px-3 border border-green-500 text-sm font-serif">
            <ArrowLeft size={15} />
            <p>Continue Shopping</p>
          </button>
        </Link>
        <button className="rounded-md py-1 px-3 bg-green-500 text-white text-sm">
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
