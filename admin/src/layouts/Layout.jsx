import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"

const Layout = () => {
  return (
    <div className="flex justify-between items-start">
      <Sidebar />
      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
