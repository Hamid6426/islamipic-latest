import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="relative w-full flex flex-col justify-between items-center">
      <Navbar />
      <div className="w-full mt-14 bg-amber-100 flex justify-center">
        <img
          src="islamipic-hero.svg"
          alt="hero image"
          className="opacity-50 h-[70vh]"
        />
      </div>
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
