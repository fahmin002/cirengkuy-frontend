import { AiFillHome, AiFillShopping, AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { HiHome, HiMiniUserCircle, HiOutlineHome, HiOutlineShoppingCart, HiOutlineUserCircle, HiShoppingCart } from 'react-icons/hi2';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdOutlineShoppingCartCheckout, MdShoppingCartCheckout } from 'react-icons/md';
import { PiClipboardDuotone, PiClipboardFill, PiClipboardText } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import { BsDatabaseFillLock, BsDatabaseLock } from 'react-icons/bs';
import { IoLogInOutline } from 'react-icons/io5';

export default function CustomerLayout() {
  const location = useLocation();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    // cek apakah admin
    if (token) {
      setIsAdmin(true);
    }
  })
  return (
    <div className='lg:w-lg lg:flex lg:justify-center'>
      {/* Navbar */}
      {/* Bottom Navigation like mobile app */}
      <nav
        className='fixed lg:w-fit rounded-t-4xl shadow-xl ring-1 ring-orange-200 shadow-orange-200 bottom-0 left-0 right-0 bg-white p-4 flex justify-center z-10'
      >
        <div className='flex lg:justify-start lg:flex-col lg:gap-8 lg:h-screen justify-around w-full ease-in-out duration-300 max-w-md'>
          {/* Home */}
          <Link to="/" className='lg:mt-10'
          >
            {location.pathname === '/' ? (
              <div className='flex flex-col items-center text-orange-500 w-12 h-12'>
                <HiHome size={40} />
                <span className='font-semibold'>Katalog</span>
              </div>
            ) : (
              <div className='flex flex-col items-center w-12 h-12'>
                <HiOutlineHome size={40} />
                <span className='font-semibold'>Katalog</span>
              </div>
            )}
          </Link>
          {/* Checkout */}
          <Link to="/checkout"
          >
            {location.pathname === '/checkout' ? (
              <div className='flex flex-col items-center text-orange-500 w-12 h-12'>
                {/* item count */}
                {totalItems > 0 && (
                  <div className='absolute lg:top-30 -top-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                    {totalItems}
                  </div>
                )}
                <MdShoppingCartCheckout size={40} />
                <span className='font-semibold'>Checkout</span>
              </div>
            ) : (
              <div className='flex flex-col items-center w-12 h-12'>
                {/* item count */}
                {totalItems > 0 && (
                  <div className='absolute lg:top-30 -top-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                    {totalItems}
                  </div>
                )}
                <MdOutlineShoppingCartCheckout size={40} />
                <span className='font-semibold'>Checkout</span>
              </div>
            )}
          </Link>
          {/* Orders */}
          <Link to="/orders"
          >
            {location.pathname === '/orders' ? (
              <div className='flex flex-col items-center text-orange-500 w-12 h-12'>
                <PiClipboardFill size={40} />
                <span className='font-semibold'>Orders</span>
              </div>
            ) : (
              <div className='flex flex-col items-center w-12 h-12'>
                <PiClipboardText size={40} />
                <span className='font-semibold'>Orders</span>
              </div>
            )}
          </Link>
          {/* Admin */}
          <Link to="/admin"
          >
            <div className='flex flex-col items-center w-12 h-12'>
              <BsDatabaseLock size={40} />
              <span className='font-semibold'>Admin</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  );
}