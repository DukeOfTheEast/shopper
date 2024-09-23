"use client";

import React, { useState } from "react";
import Logo from "@/images/shopper-logo.png";
import Image from "next/image";
import Default from "@/images/default-image.png";
import Cart from "@/images/cart.png";
import Link from "next/link";
import { useCart } from "@/context/Cart/page";
import {
  Delete,
  DeleteIcon,
  MenuIcon,
  RemoveFormatting,
  X,
} from "lucide-react";

const Navbar = () => {
  const { cartCount } = useCart();
  const [toggleMenu, setToggleMenu] = useState(false);

  const ToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  return (
    <div>
      <div className="flex items-center justify-between sm:px-10 px-3 py-4 shadow-md fixed top-0 left-0 right-0 bg-white">
        <div className="flex items-center text-orange-300 font-serif">
          <span className="">Sh</span>
          <Image src={Logo} alt="logo" width={30} height={30} />
          <span>pper</span>
        </div>
        <div className="flex items-center gap-3">
          <div className=" hidden sm:block">
            <Link href={"/signup"}>
              <button className="border border-green-500 rounded-md px-3 py-1 text-green-500 sm:mr-2">
                Signup
              </button>
            </Link>
            <Link href={"/login"}>
              <button className="bg-green-500 rounded-md px-3 py-1 text-white">
                Login
              </button>
            </Link>
          </div>
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
          <div className="sm:hidden cursor-pointer">
            {toggleMenu ? (
              <X onClick={ToggleMenu} size={30} />
            ) : (
              <MenuIcon onClick={ToggleMenu} size={30} />
            )}
          </div>
          {/* <Image
          src={Default}
          width={50}
          height={50}
          alt="default"
          className="sm:w-8 w-6 sm:h-8 h-6"
        /> */}
        </div>
      </div>
      <div className="sm:hidden">
        <div
          className={`flex flex-col mt-1 transition-all duration-500 ${
            toggleMenu
              ? "max-h-[9999px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-4"
          } absolute mx-auto bg-white w-full p-3 gap-3 shadow-md`}
        >
          <Link href={"/signup"}>
            <button className="w-full border border-green-500 rounded-md px-3 py-2 text-green-500 sm:mr-2">
              Signup
            </button>
          </Link>
          <Link href={"/login"}>
            <button className="mb-10 w-full bg-green-500 rounded-md px-3 py-2 text-white">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
