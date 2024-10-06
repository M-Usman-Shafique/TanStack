import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link, useSearchParams } from "react-router-dom";

const fetchProducts = async ({ queryKey }) => {
  const [_, limit, skip, q, category] = queryKey;

  let url = `https://dummyjson.com/products/search?limit=${limit}&skip=${skip}&q=${q}`;

  if (category) {
    url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
  }
  const response = await axios.get(url);
  const data = response.data;
  return data;
};

const fetchCategories = async () => {
  const response = await axios.get("https://dummyjson.com/products/categories");
  const data = response.data;
  return data;
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams({
    skip: 0,
    limit: 4,
  });
  const skip = parseInt(searchParams.get("skip" || 0));
  const limit = parseInt(searchParams.get("limit" || 0));
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", limit, skip, q, category],
    queryFn: fetchProducts,
    placeholderData: keepPreviousData,
  });

  const handleMove = (move) => {
    setSearchParams((prev) => {
      prev.set("skip", Math.max(skip + move, 0));
      return prev;
    });
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>Error: {error.message}</h3>;
  }

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8 lg:max-w-7xl lg:px-8">
          <div>
            <div className="relative mt-2 rounded-md flex items-center gap-8 mb-4">
              <input
                onChange={debounce(
                  (e) => {
                    setSearchParams((prev) => {
                      prev.set("skip", 0);
                      prev.delete("category");
                      prev.set("q", e.target.value);
                      return prev;
                    });
                  },
                  1000,
                  { leading: true }
                )}
                type="text"
                name="price"
                id="price"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search..."
              />
              <select
                className="border p-2 text-black"
                onChange={(e) => {
                  setSearchParams((prev) => {
                    prev.set("skip", 0);
                    prev.delete("q");
                    prev.set("category", e.target.value);
                    return prev;
                  });
                }}
              >
                <option value="">Select category</option>
                {categories?.map((category) => {
                  return (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products?.products?.map((product) => {
              return (
                <div key={product.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-64">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/products/${product.id}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-12">
            <button
              className="bg-purple-500 px-4 py-1 text-white rounded"
              onClick={() => {
                handleMove(-limit);
              }}
              disabled={skip < limit}
            >
              Prev
            </button>
            <button
              className="bg-purple-500 px-4 py-1 text-white rounded"
              onClick={() => {
                handleMove(limit);
              }}
              disabled={limit + skip >= products?.total}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
