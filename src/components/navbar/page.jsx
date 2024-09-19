"use client";

import React, { useState } from "react";
import Logo from "@/images/shopper-logo.png";
import Image from "next/image";
import Default from "@/images/default-image.png";
import Cart from "@/images/cart.png";
import Link from "next/link";
import { useCart } from "@/context/Cart/page";

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <div className="flex items-center justify-between sm:px-10 px-3 py-4 shadow-md fixed top-0 left-0 right-0 bg-white">
      <div className="flex items-center text-orange-300 font-serif">
        <span className="">Sh</span>
        <Image src={Logo} alt="logo" width={30} height={30} />
        <span>pper</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href={"/cart"} className="relative">
          <Image
            src={Cart}
            width={50}
            height={50}
            alt="default"
            className="sm:w-8 w-6 sm:h-8 h-6"
          />
          <p className="bg-red-600 text-white px-1 absolute sm:ml-5 ml-3 sm:bottom-4 bottom-3 rounded-lg">
            {cartCount}
          </p>
        </Link>
        <Image
          src={Default}
          width={50}
          height={50}
          alt="default"
          className="sm:w-8 w-6 sm:h-8 h-6"
        />
      </div>
    </div>
  );
};

export default Navbar;
