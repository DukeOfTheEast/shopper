"use client";

import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import {
  ArrowBigLeft,
  Check,
  CheckCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Shipping from "@/images/0xBilly.png";
import Link from "next/link";
import MasterCard from "@/images/mastercard.png";
import Paypal from "@/images/paypal.png";
import Visa from "@/images/visa.png";
import Navbar from "@/components/navbar/page";
import { useCart } from "@/context/Cart/page";
import CartImg from "@/images/cart-checkout.png";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/Auth/page";
import { db } from "../firebase/config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useRouter } from "next/navigation";

const StepProgressBar = ({ currentStep }) => {
  const steps = ["Cart", "Billing", "Payment"];

  return (
    <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto mt-20">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full border-2 text-xs ${
                index < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : index === currentStep
                  ? "border-x-gray-400 text-gray-800"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              {index < currentStep ? <CheckCircle2 size={20} /> : index + 1}
            </div>
            <span className="mt-2 text-sm">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                index < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CartCheckout = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { cartItems, removeFromCart, clearCart, cartCount } = useCart();
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [activePayment, setActivePayment] = useState(null);
  const [step, setStep] = useState(1);
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phoneNumber: "",
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleProceed = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      try {
        // Create the order object
        const orderData = {
          orderId: uuidv4(),
          items: cartItems,
          totalAmount: totalPrice + (activeDelivery === 2 ? 3000 : 0),
          timestamp: new Date().toISOString(),
          billingInfo: billingInfo,
          deliveryOption: activeDelivery === 1 ? "Standard" : "Fast",
          paymentOption:
            activePayment === 1
              ? "PayPal"
              : activePayment === 2
              ? "Credit/Debit Card"
              : "Cash on Delivery",
        };

        // Reference to the user's document in Firestore
        const userRef = doc(db, "users", currentUser.uid);

        // Save the order to Firestore
        await updateDoc(userRef, {
          orderHistory: arrayUnion(orderData),
        });

        // Redirect to the success page
        router.push("/cart/checkoutSuccess");
      } catch (error) {
        console.error("Error saving order to history:", error);
        alert(
          "An error occurred while processing your order. Please try again."
        );
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBillingInfoChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    alert("Payment processed successfully!");
    // Here you would typically integrate with a payment gateway
  };

  const handleDelivery = (divNumber) => {
    setActiveDelivery(divNumber);
  };

  const handlePaymentOption = (divNumber) => {
    setActivePayment(divNumber);
  };

  return (
    <div>
      <Navbar />
      {cartCount > 0 ? (
        <div className="p-4 sm:m-7 mx-auto">
          <StepProgressBar currentStep={step} />

          {step === 1 && (
            <div className="sm:flex items-center gap-5">
              <div>
                <h2 className="text-xl font-bold">Cart</h2>
                <p className="mb-3">({cartItems.length} items)</p>
                <div className="overflow-x-scroll sm:overflow-x-hidden">
                  <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto min-w-[700px]">
                    <div className="grid grid-cols-6 gap-4 font-bold mb-2 pb-2 border-b">
                      <div className="col-span-2 ">Product</div>
                      <div>Price</div>
                      <div>Quantity</div>
                      <div>Total</div>
                      <div></div>
                    </div>
                    {cartItems.length === 0 ? (
                      <div>
                        <p className="flex items-center justify-center italic my-5">
                          No items available
                        </p>
                      </div>
                    ) : (
                      <div>
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-6 gap-4 py-2 border-b items-center"
                          >
                            <div className="flex items-center gap-2 col-span-2">
                              <Image
                                src={item.image}
                                alt="ship"
                                width={50}
                                height={50}
                                className="rounded-lg"
                              />
                              {/* <div className="">{item.name}</div> */}
                              <div className="">
                                <p>{item.name}</p>
                              </div>
                            </div>
                            <div>
                              &#8358;
                              {item.price.toLocaleString()}
                            </div>
                            <div>{item.quantity}</div>
                            <div>
                              &#8358;{" "}
                              {(
                                Number(item.price) * item.quantity
                              ).toLocaleString()}
                            </div>
                            <div
                              onClick={() => removeFromCart(item.id)}
                              className="cursor-pointer"
                            >
                              <Trash2 size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* <div className="grid grid-cols-5 gap-4 py-2 font-bold mt-2">
                  <div className="col-span-4 text-right">Total:</div>
                  <div>${totalPrice.toFixed(2)}</div>
                </div> */}
                  </div>
                </div>
                <div className="inline-block">
                  <Link
                    href={"/products"}
                    className="text-xs flex items-center my-2 text-green-400"
                  >
                    <ArrowBigLeft size={20} />
                    <p>Continue Shopping</p>
                  </Link>
                </div>
              </div>
              <div className="m-5 flex flex-col items-center justify-center">
                <div className="shadow-md p-2 rounded-md w-[300px]">
                  <h2 className="font-bold">Order Summary</h2>
                  <div className="flex justify-between my-2">
                    <p>Sub Total</p>
                    <p>&#8358;{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between my-2">
                    <p>Discount</p>
                    <p>-</p>
                  </div>
                  <div className="flex justify-between my-2">
                    <p>Shipping</p>
                    <p>-</p>
                  </div>
                  <hr />
                  <div className="flex justify-between my-3">
                    <p>Total</p>
                    <p className="text-orange-300 font-bold">
                      &#8358;{totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-md p-1 flex justify-between">
                    <input
                      type="text"
                      placeholder="Discount code/Gifts"
                      className="focus:outline-none"
                    />
                    <button className="bg-green-500 rounded-md text-white px-2 py-0.5 text-base">
                      Apply
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  className="bg-green-500 rounded-md text-white w-[300px] py-2 my-3"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="sm:flex gap-5 sm:mx-20">
              <div>
                <h2 className="text-xl font-bold mb-2">Billing Information</h2>
                <input
                  type="text"
                  name="name"
                  value={billingInfo.name}
                  onChange={handleBillingInfoChange}
                  placeholder="Full Name"
                  className="w-full p-2 mb-2 border rounded focus:outline-none border-lime-500"
                />
                <input
                  type="text"
                  name="address"
                  value={billingInfo.address}
                  onChange={handleBillingInfoChange}
                  placeholder="Address"
                  className="w-full p-2 mb-2 border rounded focus:outline-none border-lime-500"
                />
                <input
                  type="text"
                  name="city"
                  value={billingInfo.city}
                  onChange={handleBillingInfoChange}
                  placeholder="City"
                  className="w-full p-2 mb-2 border rounded focus:outline-none border-lime-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  value={billingInfo.zipCode}
                  onChange={handleBillingInfoChange}
                  placeholder="Zip Code"
                  className="w-full p-2 mb-2 border rounded focus:outline-none border-lime-500"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={billingInfo.phoneNumber}
                  onChange={handleBillingInfoChange}
                  placeholder="Phone Number"
                  className="w-full p-2 mb-2 border rounded focus:outline-none border-lime-500"
                />
              </div>{" "}
              <div className="shadow-md p-2 rounded-md w-[300px] my-5">
                <h2 className="font-bold">Order Summary</h2>
                <div className="flex justify-between my-2">
                  <p>Sub Total</p>
                  <p>&#8358;{totalPrice.toLocaleString()}</p>
                </div>
                <div className="flex justify-between my-3">
                  <p>Discount</p>
                  <p>-</p>
                </div>
                <div className="flex justify-between my-3">
                  <p>Shipping</p>
                  <p>-</p>
                </div>
                <hr />
                <div className="flex justify-between my-3">
                  <p>Total</p>
                  <p className="text-orange-300 font-bold">
                    &#8358;{totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex sm:flex-row flex-col items-center justify-center gap-5">
              <div>
                <div className="shadow-md p-4 rounded-lg">
                  <p className="font-bold mb-3">Delivery options</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div
                      onClick={() => handleDelivery(1)}
                      className={`border  rounded-md p-3 font-serif cursor-pointer ${
                        activeDelivery === 1
                          ? "border-green-500 border-solid"
                          : "border-slate-300"
                      }`}
                    >
                      <p>Standard delivery(Free)</p>
                      <p>Delivered on Monday, October 12</p>
                    </div>
                    <div
                      onClick={() => handleDelivery(2)}
                      className={`${
                        activeDelivery === 2
                          ? "border-green-500 border-solid"
                          : "border-slate-300"
                      } border rounded-md p-3 font-serif cursor-pointer`}
                    >
                      <p>Fast delivery(&#8358;3000)</p>
                      <p>Delivered on Monday, October 5</p>
                    </div>
                  </div>
                </div>
                <div className="shadow-md p-4 rounded-lg">
                  <p className="font-bold mb-3 mt-7">Payment options</p>
                  <div
                    onClick={() => handlePaymentOption(1)}
                    className={`flex items-center justify-between border rounded-md p-3 font-serif cursor-pointer ${
                      activePayment === 1
                        ? "border-green-500 border-solid"
                        : "border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="font-bold">Pay with Paypal</p>
                      <p className="text-xs">
                        You will be redirected to paypal website to complete
                        your purchase securely
                      </p>
                    </div>
                    <Image
                      src={Paypal}
                      width={50}
                      height={50}
                      alt="paypal"
                      className="w-8 h-8 ml-3"
                    />
                  </div>
                  <div
                    onClick={() => handlePaymentOption(2)}
                    className={`flex border items-center justify-between rounded-md p-3 font-serif cursor-pointer my-3 ${
                      activePayment === 2
                        ? "border-green-500 border-solid"
                        : "border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="font-bold">Credit/Debit Card</p>
                      <p className="text-xs">
                        We support Mastercard, Visa, Discover and Stripe
                      </p>
                    </div>
                    <div className="flex">
                      <Image
                        src={MasterCard}
                        width={50}
                        height={50}
                        alt="mastercard"
                        className="w-8 h-8"
                      />
                      <Image
                        src={Visa}
                        width={50}
                        height={50}
                        alt="visa"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => handlePaymentOption(3)}
                    className={`border rounded-md p-3 font-serif cursor-pointer ${
                      activePayment === 3
                        ? "border-green-500 border-solid"
                        : "border-slate-300"
                    }`}
                  >
                    <p className="font-bold">Cash on Delivery</p>
                    <p className="text-xs">
                      Pay with cash when your order is delivered
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="shadow-md p-2 rounded-md w-[300px] font-serif mb-10">
                  <p className="font-bold my-3">Address</p>
                  <p className="font-semibold">
                    {billingInfo.name ? billingInfo.name : "-"}
                  </p>
                  <p>{billingInfo.address ? billingInfo.address : "-"}</p>
                  <p>
                    {billingInfo.phoneNumber ? billingInfo.phoneNumber : "-"}
                  </p>
                </div>
                <div className="shadow-md p-2 rounded-md w-[300px] my-5 font-serif">
                  <h2 className="font-bold">Order Summary</h2>
                  <div className="flex justify-between my-2">
                    <p>Sub Total</p>
                    <p>&#8358;{totalPrice.toLocaleString()} </p>
                  </div>
                  <div className="flex justify-between my-3">
                    <p>Discount</p>
                    <p>-</p>
                  </div>
                  <div className="flex justify-between my-3">
                    <p>Shipping</p>
                    <p>{activeDelivery === 2 ? 3000 : "-"}</p>
                  </div>
                  <hr />
                  <div className="flex justify-between my-3">
                    <p>Total</p>
                    <p className="text-orange-300 font-bold">
                      &#8358;
                      {(
                        totalPrice + (activeDelivery === 2 ? 3000 : 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="bg-green-500 rounded-md text-white w-[300px] py-2 "
                >
                  Checkout
                </button>
              </div>
              {/* <h2 className="text-xl font-bold mb-2">Payment</h2>
          <p>Total to pay: ${totalPrice.toFixed(2)}</p>
          <button onClick={handlePayment} className="mt-4">
            Process Payment
          </button> */}
            </div>
          )}

          <div className="mt-4 flex justify-between sm:mx-20">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="border border-green-500 rounded-md py-1 px-3"
              >
                Back
              </button>
            )}
            {step === 2 && (
              <button
                onClick={handleProceed}
                className="rounded-md py-1 px-3 bg-green-500 text-white"
              >
                Proceed
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center gap-4">
          <Image src={CartImg} width={200} height={200} alt="cart" />
          <h1 className="font-extrabold">Your cart is empty.</h1>
          <p className="text-xs sm:text-xl">
            Browse our categories and discover our best deals.
          </p>
          <Link href={"/products"}>
            <button className="my-4 font-bold py-2 px-4 rounded-md bg-green-500 text-white">
              START SHOPPING
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartCheckout;
