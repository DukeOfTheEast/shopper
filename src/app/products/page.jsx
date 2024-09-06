"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [productsData, setProductsData] = useState({ products: [] });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=100"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProductsData(data);
      } catch (e) {
        console.error("An error occurred while fetching the products:", e);
        setError(e.message);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalPages = Math.ceil(productsData.products.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsData.products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5; // Adjust this number to show more or fewer page numbers

    let startPage = Math.max(currentPage - Math.floor(totalPagesToShow / 2), 1);
    let endPage = Math.min(startPage + totalPagesToShow - 1, totalPages);

    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(endPage - totalPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="font-serif">
      <h1>Products</h1>
      {currentProducts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="m-1 mb-10">
          <ul className="flex flex-wrap items-center justify-center gap-10 gap-y-20">
            {currentProducts.map((product) => (
              <li
                key={product.id}
                className="w-64 cursor-pointer group hover:shadow-md p-2 rounded-xl"
              >
                <Link href={`/products/[id]`} as={`/products/${product.id}`}>
                  <div>
                    <Image
                      src={product.images[0]}
                      alt="image"
                      width={300}
                      height={300}
                      className="w-64 h-64 bg-slate-100 rounded-xl"
                    />
                    <p>{product.title}</p>
                    <p className="font-bold">
                      &#8358;{Math.ceil(product.price * 1500).toLocaleString()}
                    </p>
                    <div className="flex justify-between">
                      <p className="line-through">
                        &#8358;
                        {Math.ceil(
                          product.price * 1500 +
                            product.price *
                              1500 *
                              (product.discountPercentage / 100)
                        ).toLocaleString()}
                      </p>
                      <p className="text-red-600 bg-red-100 text-sm p-1 rounded-md">
                        -{product.discountPercentage}%
                      </p>
                    </div>
                    <button className="mt-5 border border-slate-950 w-60 rounded-xl p-2 font-semibold group-hover:bg-black group-hover:text-white">
                      Add to Cart
                    </button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 border rounded bg-white text-black disabled:opacity-50"
            >
              &larr;
            </button>
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === number
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 border rounded bg-white text-black disabled:opacity-50"
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
