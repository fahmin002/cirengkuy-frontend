import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { api } from "../../services/api";
import { toast } from "sonner";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!username) {
        toast.error("Field username dan password wajib diisi");
        return
      }

      if (!password) {
        toast.error("Field username dan password wajib diisi");
        return
      }
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const loginSuccess = res.success;
      if (loginSuccess === true) {
        localStorage.setItem(
          "token",
          res.data.token
        );
        navigate("/admin");
      }
    } catch (err) {
      setPassword("");
      setUsername("")
      return toast.error("Login gagal, username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      toast.message(message);
    }
  }, [])

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-orange-50
        to-white
        flex
        flex-col
        gap-10
        items-center
        justify-center
        px-5
      "
    >
      {/* Card */}
      <div
        className="
          w-full max-w-sm
          bg-white
          rounded-[32px]
          shadow-xl
          border border-gray-100
          overflow-hidden
        "
      >
        {/* Top Accent */}
        <div
          className="
            h-2
            bg-gradient-to-r
            from-orange-400
            to-orange-500
          "
        />

        <div className="p-7">
          {/* Heading */}
          <div className="mb-7">
            <p className="text-sm text-orange-500 font-semibold">
              CirengKuy Admin
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Selamat Datang
            </h1>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Login untuk mengelola pesanan,
              produk, dan dashboard operasional.
            </p>
          </div>

          {/* Username */}
          <div className="mb-4 text-left">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              required
              placeholder="Masukkan username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="
                w-full mt-2
                border border-gray-200
                rounded-2xl
                px-4 py-3
                outline-none
                focus:border-orange-400
                transition
              "
            />
          </div>

          {/* Password */}
          <div className="relative mb-6 text-left">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full mt-2
                border border-gray-200
                rounded-2xl
                px-4 py-3
                outline-none
                focus:border-orange-400
                transition
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-14 text-orange-500 -translate-y-1/2"
            >
              {showPassword ? (
                <HiEyeOff size={20} />
              ) : (
                <HiEye size={20} />
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              bg-orange-500
              hover:bg-orange-600
              active:scale-[0.98]
              disabled:opacity-60
              text-white
              py-4
              rounded-2xl
              font-semibold
              shadow-lg shadow-orange-200
              transition
            "
          >
            {loading
              ? "Memproses..."
              : "Login Admin"}
          </button>
        </div>
      </div>
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="
          mb-10
          flex items-center gap-2
          bg-white
          border border-gray-100
          shadow-sm
          rounded-2xl
          px-4 py-3
          text-sm font-medium text-gray-700
          active:scale-95
          transition
        "
      >
        <BiArrowBack size={18} />
        Kembali
      </button>
    </div>
  );
}