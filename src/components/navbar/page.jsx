"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/images/shopper-logo.png";
import Image from "next/image";
import Default from "@/images/default-image.png";
import Cart from "@/images/cart.png";
import Link from "next/link";
import { useCart } from "@/context/Cart/page";
import {
  Delete,
  DeleteIcon,
  LogOut,
  MenuIcon,
  RemoveFormatting,
  X,
} from "lucide-react";
import { useAuth } from "@/context/Auth/page";
import { useRouter } from "next/navigation";
import UserProfile from "@/app/userProfile/page";
import { useProfile } from "@/context/Profile/page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";

const Navbar = () => {
  const { cartCount } = useCart();
  const [toggleMenu, setToggleMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { photoURL, setPhotoURL } = useProfile();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();

        if (docSnap.exists()) {
          setPhotoURL(userData?.photoURL);
        }
      }
    };

    fetchProfileImage();
  }, [currentUser, setPhotoURL]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/products");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
    console.log(toggleMenu);
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
          {!currentUser ? (
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
          ) : (
            <div></div>
          )}
          <Link href={"/cart"} className="relative">
            <Image
              src={Cart}
              width={50}
              height={50}
              alt="cart"
              className="w-6 h-6"
            />
            <p className="bg-red-600 text-white px-1 absolute sm:ml-3 ml-3 sm:bottom-3 bottom-3 rounded-lg">
              {cartCount}
            </p>
          </Link>
          {currentUser ? (
            <div>
              <Link href={"/userProfile"}>
                <Image
                  src={photoURL}
                  width={50}
                  height={50}
                  alt="default"
                  className="sm:w-7 w-6 sm:h-7 h-6 rounded-full"
                  onMouseOver={() => setIsHovered(true)}
                  onMouseOut={() => setIsHovered(false)}
                />
              </Link>
              {isHovered && (
                <div
                  className=" absolute right-10 mb-2 w-48 p-2 pr-2 border border-green-500 bg-white rounded-s-2xl shadow-xl text-green-500"
                  onMouseOver={() => setIsHovered(true)}
                  onMouseOut={() => setIsHovered(false)}
                >
                  <Link href="/userProfile">
                    <p>Profile</p>
                  </Link>
                  <button onClick={handleLogout} className="flex gap-1 mt-3">
                    <LogOut size={20} />
                    <p>Logout</p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden"></div>
          )}
          <div className="sm:hidden cursor-pointer">
            {toggleMenu ? (
              <X onClick={handleToggle} size={30} />
            ) : (
              <MenuIcon onClick={handleToggle} size={30} />
            )}
          </div>
        </div>
      </div>

      {/*menu small screen*/}
      <div className="sm:hidden fixed w-full top-12">
        <div
          className={`flex flex-col transition-all duration-500 ${
            toggleMenu
              ? "max-h-[9999px] opacity-100 translate-y-0"
              : "max-h-0 hidden -translate-y-4"
          } mx-auto bg-white p-3 py-7 gap-4 shadow-md`}
        >
          {currentUser ? (
            <div>
              <Link href={"/userProfile"}>
                <p className="my-3 text-green-500">Profile</p>
              </Link>
              <div
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 border border-green-500 text-green-500 rounded-md p-2"
              >
                <LogOut size={20} />
                <p>Logout</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href={"/signup"}>
                <button className="w-full mt-5 border border-green-500 rounded-md px-3 py-2 text-green-500 sm:mr-2">
                  Signup
                </button>
              </Link>
              <Link href={"/login"}>
                <button className="mb-2 w-full bg-green-500 rounded-md px-3 py-2 text-white">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
