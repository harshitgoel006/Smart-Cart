// import React, { useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// import ProductGrid from "../../components/product/ProductGrid";
// import ProductFilters from "../../components/product/ProductFilters";
// import ProductSearch from "./components/ProductSearch";
// import ProductSort from "../../components/product/ProductSort";
// import Pagination from "./components/Pagination";
// import EmptyState from "./components/EmptyState";

// // mock data (backend ready)
// import allProducts from "../../data/products";

// // utils (pure logic)
// import filterProducts from "./utils/filterProducts";
// import sortProducts from "./utils/sortProducts";
// import paginate from "./utils/paginate";

// const PRODUCTS_PER_PAGE = 12;

// const ProductsPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // URL PARAMS (single source of truth)
//   const category = searchParams.get("category");
//   const subCategory = searchParams.get("sub");
//   const search = searchParams.get("search") || "";
//   const sort = searchParams.get("sort") || "latest";
//   const page = Number(searchParams.get("page")) || 1;
//   const minPrice = Number(searchParams.get("minPrice"));
//   const maxPrice = Number(searchParams.get("maxPrice"));
//   const rating = Number(searchParams.get("rating"));

//   /* ----------------------------------
//       FILTER → SORT → PAGINATE
//   ---------------------------------- */

//   const filteredProducts = useMemo(() => {
//     return filterProducts(allProducts, {
//       category,
//       subCategory,
//       search,
//       minPrice,
//       maxPrice,
//       rating,
//     });
//   }, [category, subCategory, search, minPrice, maxPrice, rating]);

//   const sortedProducts = useMemo(() => {
//     return sortProducts(filteredProducts, sort);
//   }, [filteredProducts, sort]);

//   const paginatedData = useMemo(() => {
//     return paginate(sortedProducts, page, PRODUCTS_PER_PAGE);
//   }, [sortedProducts, page]);

//   /* ----------------------------------
//       HANDLERS
//   ---------------------------------- */

//   const updateParam = (key, value) => {
//     const params = new URLSearchParams(searchParams);

//     if (!value) {
//       params.delete(key);
//     } else {
//       params.set(key, value);
//     }

//     // page reset on filter change
//     if (key !== "page") params.set("page", 1);

//     setSearchParams(params);
//   };

//   /* ----------------------------------
//       UI
//   ---------------------------------- */

//   return (
//     <section className="relative min-h-screen bg-[#fafafa] py-10">
//       <div className="max-w-[1600px] mx-auto px-4 lg:px-10">

//         {/* HEADER */}
//         <div className="mb-10 flex flex-col gap-4">
//           <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
//             Products
//           </h1>
//           <p className="text-sm text-gray-500 max-w-xl">
//             Browse curated collections across categories. Filter, sort and
//             discover products tailored for you.
//           </p>
//         </div>

//         {/* SEARCH + SORT BAR */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <ProductSearch
//             value={search}
//             onChange={(val) => updateParam("search", val)}
//           />

//           <ProductSort
//             value={sort}
//             onChange={(val) => updateParam("sort", val)}
//           />
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

//           {/* FILTERS */}
//           <aside className="sticky top-24 h-fit">
//             <ProductFilters
//               selected={{
//                 category,
//                 subCategory,
//                 minPrice,
//                 maxPrice,
//                 rating,
//               }}
//               onChange={updateParam}
//             />
//           </aside>

//           {/* PRODUCTS */}
//           <div className="flex flex-col gap-10">

//             {paginatedData.items.length === 0 ? (
//               <EmptyState />
//             ) : (
//               <>
//                 <ProductGrid products={paginatedData.items} />

//                 <Pagination
//                   currentPage={page}
//                   totalPages={paginatedData.totalPages}
//                   onPageChange={(p) => updateParam("page", p)}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductsPage;




import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import ProductGrid from "../../components/product/ProductGrid";
import ProductFilters from "../../components/product/ProductFilters";
import ProductSort from "../../components/product/ProductSort";
import Pagination from "../../components/product/Pagination";
import EmptyState from "../../components/product/EmptyState";

import allProducts from "../../assets";
import filterProducts from "../../utils/product/filterProducts";
import sortProducts from "../../utils/product/sortProducts";
import paginate from "../../utils/product/paginate";

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ URL = single source of truth
  const category = searchParams.get("category");
  const subCategory = searchParams.get("sub");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = Number(searchParams.get("minPrice"));
  const maxPrice = Number(searchParams.get("maxPrice"));
  const rating = Number(searchParams.get("rating"));

  /* ---------------- FILTER → SORT → PAGINATE ---------------- */

  const filteredProducts = useMemo(
    () =>
      filterProducts(allProducts, {
        category,
        subCategory,
        search,
        minPrice,
        maxPrice,
        rating,
      }),
    [category, subCategory, search, minPrice, maxPrice, rating]
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort]
  );

  const paginatedData = useMemo(
    () => paginate(sortedProducts, page, PRODUCTS_PER_PAGE),
    [sortedProducts, page]
  );

  /* ---------------- PARAM HANDLER ---------------- */

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value === null || value === "" || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // filter/search/sort change → reset page
    if (key !== "page") params.set("page", 1);

    setSearchParams(params);
  };

  /* ---------------- UI ---------------- */

  return (
    <section className="relative min-h-screen bg-[#fafafa] py-10">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-10">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            {category ? category.replace("-", " ") : "All Products"}
          </h1>
          {search && (
            <p className="text-sm text-gray-500">
              Showing results for <span className="font-semibold">“{search}”</span>
            </p>
          )}
        </div>

        {/* SORT BAR ONLY (search navbar se) */}
        <div className="flex justify-end mb-8">
          <ProductSort
            value={sort}
            onChange={(val) => updateParam("sort", val)}
          />
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          {/* FILTERS */}
          <aside className="sticky top-24 h-fit">
            <ProductFilters
              selected={{
                category,
                subCategory,
                minPrice,
                maxPrice,
                rating,
              }}
              onChange={updateParam}
            />
          </aside>

          {/* PRODUCTS */}
          <div className="flex flex-col gap-10">
            {paginatedData.items.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ProductGrid products={paginatedData.items} />

                <Pagination
                  currentPage={page}
                  totalPages={paginatedData.totalPages}
                  onPageChange={(p) => updateParam("page", p)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;