import { useState } from "react";
import { api } from "../../services/api";
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log(res);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/admin/orders';
    } catch (err) {
      console.error('Login error:', err);
      alert('Login gagal');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow w-80">
        <h2 className="text-lg font-bold mb-4">Admin Login</h2>

        <input
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}