import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="h-screen bg-orange-50 flex flex-col justify-between p-6 pb-24">
      <div />

      <div className="text-center">
        <div className="w-40 h-40 bg-orange-200 rounded-full mx-auto mb-6">
            {/* logo */}
            <img src="web-app-manifest-192x192.png" alt="" srcSet="" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-3xl font-bold mb-2">CirengKuy</h1>
        <p className="text-gray-500 font-semibold">
          Cireng Tebal, Enak, dan Gak Bikin Kantong Bolong!
        </p>
      </div>

      <Link to="/"
        className="bg-orange-500 text-white py-4 rounded-xl font-semibold shadow-lg"
      >
        Mulai Pesan
      </Link>
    </div>
  );
}