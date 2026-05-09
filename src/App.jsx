// import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
// import './App.css'
// import Home from './pages/Home'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Customer */}
//         <Route path="/" element={<Home />} />
//         <Route path="/checkout" element={<h1>Checkout Page</h1>} />

//         {/* Admin */}
//         <Route path="/admin/orders" element={
//           <AdminRoute>
//             <AdminOrders />
//           </AdminRoute>
//         } />

//         {/* <Route path="/products" element={<h1>Products Page</h1>} />
//         <Route path="/cart" element={<h1>Cart Page</h1>} /> */}
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </>
  )
}

export default App;