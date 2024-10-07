import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./main";
import axios from "axios";

const fetchPosts = async () => {
  const response = await axios.get(
    "http://localhost:3000/posts?_sort=id&_order=desc"
  );
  return response.data;
};

const addPost = async (newPost) => {
  return await axios.post("http://localhost:3000/posts", newPost, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export default function Optimistic() {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const { mutate, isError, isPending, variables } = useMutation({
    mutationFn: addPost,
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {
      id: Date.now(),
      title: e.target.elements.title.value,
    };
    mutate(post);
  };

  const handleRetry = (post) => {
    mutate(post);
  };

  return (
    <>
      <div className="p-4 flex gap-12">
        <div className="flex-1">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              className="border mb-4 p-2"
              type="text"
              placeholder="Title"
              name="title"
            />
            <button
              className="border mb-4 p-2 bg-purple-500 text-white"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-4">Posts:</h2>
          <ul>
            {isPending && (
              <li className="border p-2 mb-4 opacity-40" key={variables.id}>
                {variables.title}
              </li>
            )}
            {isError && (
              <li
                className="border p-2 mb-4 flex justify-between"
                key={variables.id}
              >
                <span className="text-red-500">{variables.title}</span>
                <button
                  onClick={() => handleRetry(variables)}
                  className="text-blue-500"
                >
                  Retry
                </button>
              </li>
            )}

            {posts?.map((post) => {
              return (
                <li className="border p-2 mb-4" key={post.id}>
                  {post.title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
