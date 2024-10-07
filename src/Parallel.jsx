import React from "react";
import { useQuery, useQueries } from "@tanstack/react-query";

const fetchUser = async () => {
  const response = await axios.get(`https://dummyjson.com/users/${id}`);
  const data = response.data;
  console.log(data);
  return data;
};

const Parallel = () => {
  const [userIds, setUserIds] = React.useState([1]);

  // useQuery is a hook hence cannot be called inside a callback, rather it must be called inside react function component or react custom hook:
  // userIds.forEach((id) => {
  //   const userQuery = useQuery({
  //     queryKey: ["user", id],
  //     queryFn: fetchUser,
  //   });
  // });
  

  // Parallel Queries:
  const userQueries = useQueries({
    queries: userIds.map((id) => {
      return {
        queryKey: ["user", id],
        queryFn: fetchUser,
      };
    }),
  });

  return (
    <div>
      <button
        onClick={() =>
          setUserIds((prev) => {
            return [...prev, Date.now()];
          })
        }
      >
        Load more
      </button>

      {userIds.map((id) => (
        <h1 key={id}>{id}</h1>
      ))}
    </div>
  );
};

export default Parallel;
