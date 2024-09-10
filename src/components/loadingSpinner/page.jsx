"use client";
import React from "react";
import { PulseLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <PulseLoader color="#22c55e" size={15} margin={2} />
    </div>
  );
};

export default LoadingSpinner;
