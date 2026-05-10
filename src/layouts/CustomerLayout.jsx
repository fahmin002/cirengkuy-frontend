import { AiFillHome, AiFillShopping, AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { HiHome, HiMiniUserCircle, HiOutlineHome, HiOutlineShoppingCart, HiOutlineUserCircle, HiShoppingCart } from 'react-icons/hi2';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdOutlineShoppingCartCheckout, MdShoppingCartCheckout } from 'react-icons/md';
import { PiClipboardDuotone, PiClipboardFill, PiClipboardText } from 'react-icons/pi';

export default function CustomerLayout() {
  const location = useLocation();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div>
      {/* Navbar */}
      {/* Bottom Navigation like mobile app */}
      <nav
        className='fixed rounded-t-4xl shadow-xl bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center z-10'
      >
        <div className='flex justify-around w-full ease-in-out duration-300 max-w-md'>
          {/* Home */}
          <Link to="/"
          >
            {location.pathname === '/' ? (
              <div className='flex flex-col items-center text-orange-500 w-12 h-12'>
                <HiHome size={40} />
                <span className='font-semibold'>Home</span>
              </div>
            ) : (
              <div className='flex flex-col items-center w-12 h-12'>
                <HiOutlineHome size={40} />
                <span className='font-semibold'>Home</span>
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
                  <div className='absolute -top-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
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
                  <div className='absolute -top-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                    {totalItems}
                  </div>
                )}
                <MdOutlineShoppingCartCheckout size={40} />
                <span className='font-semibold'>Checkout</span>
              </div>
            )}
          </Link>
          {/* Profile */}
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
        </div>
      </nav>

      {/* Content */}
      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  );
}