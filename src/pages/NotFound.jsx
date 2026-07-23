import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      className="
        min-h-screen
        flex flex-col
        items-center
        justify-center
        bg-orange-50
        px-6
        text-center
      "
    >
      <h1
        className="
          text-7xl
          font-black
          text-orange-500
        "
      >
        404
      </h1>

      <h2
        className="
          mt-4
          text-2xl
          font-bold
          text-gray-800
        "
      >
        Halaman tidak ditemukan
      </h2>

      <p
        className="
          mt-2
          text-gray-500
          max-w-sm
        "
      >
        <span className="italic">"God does not play dice with the universe." </span>
        <span>Albert Einstein</span>
      </p>

      <div
        onClick={() => navigate(-1)}
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          bg-orange-500
          text-white
          px-5 py-3
          rounded-2xl
          font-medium
          shadow-sm
          active:scale-95
          transition
        "
      >
        <BiArrowBack size={18} />
        Kembali
      </div>
    </div>
  );
}