"use client";

import LoadingSpinner from "@/components/loadingSpinner/page";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/page";

export default function Home() {
  const router = useRouter();
  const { page: pageParam, tag: tagParam } = useParams();
  const [productsData, setProductsData] = useState({ products: [] });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1
  );
  const [productsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(tagParam || "");

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

  useEffect(() => {
    // Update the URL when the currentPage or selectedTag changes
    router.push(
      `/?page=${currentPage}${selectedTag ? `&tag=${selectedTag}` : ""}`,
      undefined,
      { shallow: true }
    );
  }, [currentPage, selectedTag, router]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredProducts = productsData.products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTag ? product.tags.includes(selectedTag) : true)
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;

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

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    router.push(`/?page=1&tag=${tag}`, undefined, { shallow: true });
  };

  const handleClearTag = () => {
    setSelectedTag("");
    setCurrentPage(1);
    router.push(`/?page=1`, undefined, { shallow: true });
  };

  return (
    <div className="font-serif relative">
      <Navbar />
      <div className="items-center mb-4 mt-20">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className=" sm:w-1/3 px-2 py-1 border rounded-3xl sm:mx-3 mx-1 my-2 focus:outline-none"
        />
        <div className="ml-4 flex overflow-x-scroll category my-3">
          <button
            onClick={handleClearTag}
            className={`mx-1 px-3 py-1 max-h-10 border rounded mb-3 ${
              selectedTag === ""
                ? "bg-green-500 text-white"
                : "bg-white text-black"
            }`}
          >
            All
          </button>
          {[
            ...new Set(
              productsData.products.flatMap((product) => product.tags)
            ),
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`mx-1 px-2 py-1 border max-h-10 whitespace-nowrap mb-3 rounded ${
                selectedTag === tag
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {currentProducts.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="m-1 pb-10">
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
                    <button className="mt-5 border border-green-500 w-60 rounded-xl p-2 font-semibold group-hover:bg-green-500 group-hover:text-white">
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
                    ? "bg-green-500 text-white"
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
