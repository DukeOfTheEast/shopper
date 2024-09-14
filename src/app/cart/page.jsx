"use client";

import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import { ArrowBigLeft, CheckCircle2, Trash2 } from "lucide-react";
import Image from "next/image";
import Shipping from "@/images/0xBilly.png";
import Link from "next/link";

const StepProgressBar = ({ currentStep }) => {
  const steps = ["Cart", "Billing", "Payment"];

  return (
    <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
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
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([
    { id: 1, name: "Product 1", price: 10, quantity: 2 },
    { id: 2, name: "Product 2", price: 20, quantity: 1 },
    { id: 3, name: "Product 3", price: 15, quantity: 3 },
  ]);
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phoneNumber: "",
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleProceed = () => {
    if (step < 3) setStep(step + 1);
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

  return (
    <div className="p-4  mx-auto">
      <StepProgressBar currentStep={step} />

      {step === 1 && (
        <div className="sm:flex items-center">
          <div>
            <h2 className="text-xl font-bold">Cart</h2>
            <p className="mb-3">(3 items)</p>
            <div className="overflow-x-scroll sm:overflow-x-hidden">
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto min-w-[700px]">
                <div className="grid grid-cols-6 gap-4 font-bold mb-2 pb-2 border-b">
                  <div className="col-span-2 ">Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Total</div>
                  <div></div>
                </div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-6 gap-4 py-2 border-b items-center"
                  >
                    <div className="flex items-center gap-2 col-span-2">
                      <Image
                        src={Shipping}
                        alt="ship"
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                      {/* <div className="">{item.name}</div> */}
                      <div className="">
                        <p>Eyeshadow Palette with Mirror</p>
                      </div>
                    </div>
                    <div>&#8358;{item.price.toFixed(2)}</div>
                    <div>{item.quantity}</div>
                    <div>&#8358;{(item.price * item.quantity).toFixed(2)}</div>
                    <div className="cursor-pointer">
                      <Trash2 size={20} />
                    </div>
                  </div>
                ))}
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
                <p>&#8358;100</p>
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
                <p className="text-orange-300 font-bold">&#8358;1000</p>
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
        <div>
          <h2 className="text-xl font-bold mb-2">Billing Information</h2>
          <input
            type="text"
            name="name"
            value={billingInfo.name}
            onChange={handleBillingInfoChange}
            placeholder="Full Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="address"
            value={billingInfo.address}
            onChange={handleBillingInfoChange}
            placeholder="Address"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="city"
            value={billingInfo.city}
            onChange={handleBillingInfoChange}
            placeholder="City"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="zipCode"
            value={billingInfo.zipCode}
            onChange={handleBillingInfoChange}
            placeholder="Zip Code"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            value={billingInfo.phoneNumber}
            onChange={handleBillingInfoChange}
            placeholder="Phone Number"
            className="w-full p-2 mb-2 border rounded"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Payment</h2>
          <p>Total to pay: ${totalPrice.toFixed(2)}</p>
          <button onClick={handlePayment} className="mt-4">
            Process Payment
          </button>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        {step > 1 && <button onClick={handleBack}>Back</button>}
        {step === 2 && <button onClick={handleProceed}>Proceed</button>}
      </div>
    </div>
  );
};

export default CartCheckout;
