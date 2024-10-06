import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const fetchProduct = async (id) => {
  const response = await axios.get(`https://dummyjson.com/products/${id}`);
  const data = response.data;
  //   console.log(data);
  return data;
};

const updateProduct = async (id, newProduct) => {
  const response = await axios.put(
    `https://dummyjson.com/products/${id}`,
    newProduct
  );
  return response.data;
};

export default function Product() {
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  const {
    mutate,
    isLoading: isUpdating,
    error: updateError,
  } = useMutation({
    // newProduct is what we recieve from mutate of button
    mutationFn: (newProduct) => updateProduct(id, newProduct),
    onSuccess: (updatedProduct) => {
      console.log("Product updated:", updatedProduct);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex rounded-lg shadow-lg overflow-hidden bg-white max-w-2xl w-full">
        {/* Left section */}
        <div className="img-box flex flex-col gap-2 p-4 flex-grow">
          {" "}
          {/* Added flex-grow */}
          {product.images.map((image, index) => (
            <div
              key={index}
              className="w-32 h-28 bg-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`${product.title} thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Right section */}
        <div className="card flex flex-col w-full p-4 min-h-full">
          {" "}
          {/* Added min-h-full */}
          <div className="main-img relative w-full h-72 bg-gray-200 mb-4">
            <img
              src={product.images[0]}
              alt={product.title}
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold mb-1">{product.title}</h1>
          <h3 className="text-lg text-gray-500 mb-3">{product.brand}</h3>
          <p className="text-sm text-gray-700 mb-3">{product.description}</p>
          <p className="text-xl font-semibold">
            Price: <span className="text-purple-600">${product.price}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useState } from "react";

// const fetchProduct = async (id) => {
//   const response = await axios.get(`https://dummyjson.com/products/${id}`);
//   return response.data;
// };

// const updateProduct = async ({ id, updatedData }) => {
//   const response = await axios.put(`https://dummyjson.com/products/${id}`, updatedData);
//   return response.data;
// };

// const Product = () => {
//   const { id } = useParams();
//   const queryClient = useQueryClient();

//   const { isLoading, error, data: product } = useQuery({
//     queryKey: ["product", id],
//     queryFn: () => fetchProduct(id),
//   });

//   const [formData, setFormData] = useState({
//     title: "",
//     brand: "",
//     price: "",
//   });

//   // Mutation to handle the PUT request
//   const mutation = useMutation({
//     mutationFn: (updatedProduct) => updateProduct(updatedProduct),
//     onSuccess: () => {
//       // Invalidate and refetch product data after mutation success
//       queryClient.invalidateQueries(["product", id]);
//     },
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading product</div>;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate({ id, updatedData: formData });
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] text-gray-100">
//       <div className="max-w-md w-full bg-[#242424] rounded-lg shadow-lg overflow-hidden">
//         <div className="relative w-full h-64 bg-gray-800">
//           <img
//             src={product.images[0]}
//             alt={product.title}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <div className="p-6">
//           <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
//           <h3 className="text-lg text-gray-400 mb-4">{product.brand}</h3>
//           <p className="text-sm text-gray-300 mb-6">{product.description}</p>
//           <p className="text-xl font-semibold text-gray-100">Price: ${product.price}</p>

//           {/* Image thumbnails */}
//           <div className="mt-4 flex gap-2">
//             {product.images.map((image, index) => (
//               <div key={index} className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
//                 <img
//                   src={image}
//                   alt={`${product.title} thumbnail ${index + 1}`}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Form to update product details */}
//           <form className="mt-6" onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-gray-400">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder={product.title}
//                 className="w-full mt-1 p-2 bg-gray-700 text-gray-200 rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-400">Brand</label>
//               <input
//                 type="text"
//                 name="brand"
//                 value={formData.brand}
//                 onChange={handleChange}
//                 placeholder={product.brand}
//                 className="w-full mt-1 p-2 bg-gray-700 text-gray-200 rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-400">Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 placeholder={product.price}
//                 className="w-full mt-1 p-2 bg-gray-700 text-gray-200 rounded"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full p-2 bg-blue-600 rounded hover:bg-blue-500"
//             >
//               {mutation.isLoading ? "Updating..." : "Update Product"}
//             </button>
//           </form>

//           {/* Show success or error message */}
//           {mutation.isError && <p className="text-red-500">Error updating product.</p>}
//           {mutation.isSuccess && <p className="text-green-500">Product updated successfully!</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;
