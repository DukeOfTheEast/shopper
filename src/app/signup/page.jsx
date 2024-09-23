import React from "react";
import SignupImage from "@/images/signup-img.jpg";
import Image from "next/image";
import Google from "@/images/google.png";
import Facebook from "@/images/facebook.png";
import Link from "next/link";

const Signup = () => {
  return (
    <div className="flex sm:p-0 p-3">
      <Image
        src={SignupImage}
        alt="signup"
        width={300}
        height={300}
        className="w-1/2 h-screen hidden md:block"
      />
      <div className="flex flex-col justify-center md:w-1/2 md:px-36 mt-5 sm:mt-2">
        <h1 className="sm:hidden font-extrabold text-center sm:text-left text-green-500 text-3xl">
          Shop with Purpose:
          <br /> Join our Shopping Revolution
        </h1>
        <h1 className="hidden sm:block font-extrabold text-center sm:text-left text-green-500 text-3xl">
          Shop with Purpose: Join our Shopping Revolution
        </h1>
        <p className="my-2 font-bold text-xs text-center">
          Enter your credentials to create an account.
        </p>
        <div className="flex text-xs md:my-2 gap-2 mt-3">
          <div className="flex border border-gray-300 gap-2 py-3 md:px-6 px-4 rounded-xl cursor-pointer">
            <Image src={Google} width={15} height={15} alt="google" />
            <p>Login with Google</p>
          </div>
          <div className="flex border border-gray-300 gap-2 py-3 md:px-6 px-4 rounded-xl cursor-pointer">
            <Image src={Facebook} width={15} height={15} alt="facebook" />
            <p>Login with Facebook</p>
          </div>
        </div>
        <p className="text-center md:my-3">or</p>
        <form className="flex flex-col gap-1">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="border border-gray-300 p-2 focus:outline-none focus:border-green-500 rounded-xl w-full"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border border-gray-300 p-2 focus:outline-none focus:border-green-500 rounded-xl w-full"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="border border-gray-300 p-2 focus:outline-none focus:border-green-500 rounded-xl w-full"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm password"
                type="password"
                autoComplete="new-password"
                required
                className="border border-gray-300 p-2 focus:outline-none focus:border-green-500 rounded-xl w-full"
              />
            </div>
          </div>

          <div className="flex gap-1 my-2 text-xs">
            <input type="checkbox" name="" id="" />
            <p>I agree to the terms and conditions</p>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded-xl p-2"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="text-sm my-2">
          Already have an account?{" "}
          <span className="text-green-500 font-bold">
            <Link href={"/login"}>Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
