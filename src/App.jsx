import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="flex gap-5 justify-center font-bold text-lg bg-gray-200 p-2">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/parallel">Parallel</Link>
        <Link to="/optimistic">Optimistic</Link>
        <Link to="/dependant">Dependant</Link>
      </div>
    </>
  );
}

export default App;
