import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AiFillHome,
  AiFillShopping,
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FaRegUser, FaUser } from "react-icons/fa";
import {
  HiHome,
  HiMiniUserCircle,
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineUserCircle,
  HiShoppingCart,
} from "react-icons/hi2";
import {
  RiBarChartBoxLine,
  RiBarChartFill,
  RiDashboardHorizontalFill,
  RiDashboardHorizontalLine,
} from "react-icons/ri";
import { PiPackageDuotone, PiPackageFill } from "react-icons/pi";
import { TbLogout } from "react-icons/tb";
import { logout } from "../services/logout";
import { MdInsertChart, MdInsertChartOutlined } from "react-icons/md";
export default function AdminLayout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/admin/login" ? (
        <>
          <div className="">
            {/* Navbar */}
            {/* Bottom Navigation like mobile app */}
            <nav className="fixed rounded-t-4xl ring-1 ring-orange-200 shadow-orange-200 shadow-2xl bottom-0 left-0 right-0 bg-white p-4 flex justify-center z-10">
              <div className="flex justify-around w-full ease-in-out duration-300 max-w-md">
                {/* Home */}
                <Link to="/admin">
                  {location.pathname === "/admin" ? (
                    <div className="flex flex-col items-center text-orange-500 w-12 h-12">
                      <RiDashboardHorizontalFill size={20} />
                      <span className="font-semibold text-sm">Dashboard</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-12 h-12">
                      <RiDashboardHorizontalLine size={20} />
                      <span className="font-semibold text-sm">Dashboard</span>
                    </div>
                  )}
                </Link>
                {/* Products */}
                <Link to="/admin/products">
                  {location.pathname === "/admin/products" ? (
                    <div className="flex flex-col items-center text-orange-500 w-12 h-12">
                      <PiPackageFill size={20} />
                      <span className="font-semibold text-sm">Products</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-12 h-12">
                      <PiPackageDuotone size={20} />
                      <span className="font-semibold text-sm">Products</span>
                    </div>
                  )}
                </Link>
                {/* Orders */}
                <Link to="/admin/orders">
                  {location.pathname === "/admin/orders" ? (
                    <div className="flex flex-col items-center text-orange-500 w-12 h-12">
                      <HiShoppingCart size={20} />
                      <span className="font-semibold text-sm">Orders</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-12 h-12">
                      <HiOutlineShoppingCart size={20} />
                      <span className="font-semibold text-sm">Orders</span>
                    </div>
                  )}
                </Link>
                {/* Reports */}
                <Link to="/admin/reports">
                  {location.pathname === "/admin/reports" ? (
                    <div className="flex flex-col items-center text-orange-500 w-12 h-12">
                      <MdInsertChart size={20} />
                      <span className="font-semibold text-sm">Reports</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-12 h-12">
                      <MdInsertChartOutlined size={20} />
                      <span className="font-semibold text-sm">Reports</span>
                    </div>
                  )}
                </Link>
                {/* Logout */}
                <button onClick={logout}>
                  <div className="flex flex-col items-center w-12 h-12">
                    <TbLogout size={20} />
                    <span className="font-semibold text-sm">Logout</span>
                  </div>
                </button>
              </div>
            </nav>

            {/* Content */}
            <main className="p-4">
              <Outlet />
            </main>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
