import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="flex gap-6 justify-center font-bold bg-gray-200">
        <Link to="/" className="hover:bg-gray-300 px-4 py-3">Home</Link>
        <Link to="/products" className="hover:bg-gray-300 px-4 py-3">Products</Link>
        <Link to="/parallel" className="hover:bg-gray-300 px-4 py-3">Parallel</Link>
        <Link to="/optimistic" className="hover:bg-gray-300 px-4 py-3">Optimistic</Link>
        <Link to="/dependant" className="hover:bg-gray-300 px-4 py-3">Dependant</Link>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}

export default App;
