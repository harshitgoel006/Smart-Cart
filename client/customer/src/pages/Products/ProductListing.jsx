import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getFilteredProducts } from "./productSelectors";
import { categories } from "../../data/categories";

import ProductGrid from "../../components/product/ProductGrid";
import ProductFilters from "../../components/product/ProductFilters";
import ProductSort from "../../components/product/ProductSort";
import Pagination from "../../components/product/Pagination";

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState({
    items: [],
    totalPages: 1,
    page: 1,
  });

  const query = Object.fromEntries([...searchParams]);

  useEffect(() => {
    const updatedQuery = { ...query };

    // 🔥 Smart Category Auto-Detect from Search
    if (query.search && !query.category) {
      const matchedCategory = categories.find((cat) =>
        cat.name.toLowerCase().includes(query.search.toLowerCase())
      );

      if (matchedCategory) {
        updatedQuery.category = matchedCategory.slug;
        setSearchParams(updatedQuery);
        return; // stop here to prevent double load
      }
    }

    const loadProducts = async () => {
      const result = await getFilteredProducts(updatedQuery);
      setProducts(result);
    };

    loadProducts();

  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex gap-8">

        {/* Sidebar */}
        <ProductFilters
          query={query}
          setSearchParams={setSearchParams}
        />

        {/* Main Content */}
        <div className="flex-1">

          <ProductSort
            query={query}
            setSearchParams={setSearchParams}
          />

          <ProductGrid products={products?.items || []} />

          <Pagination
            currentPage={products?.page || 1}
            totalPages={products?.totalPages || 1}
            setSearchParams={setSearchParams}
            query={query}
          />

        </div>
      </div>
    </div>
  );
};

export default ProductListing;
