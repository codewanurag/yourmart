import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function NearbySellers() {
  const [city, setCity] = useState('Bhopal');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, [city]);

  const fetchSellers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/sellers/nearby?city=${city}`
      );

      setSellers(res.data.sellers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Nearby Sellers
          </h2>

          <p className="text-gray-400 mt-2">
            Discover creators and sellers near you
          </p>
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl"
        >
          <option>Bhopal</option>
          <option>Indore</option>
          <option>Delhi</option>
          <option>Mumbai</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400">
          Loading nearby sellers...
        </div>
      ) : sellers.length === 0 ? (
        <div className="text-gray-500">
          No nearby sellers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-purple-500 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    seller.avatar ||
                    'https://i.pravatar.cc/150?img=12'
                  }
                  alt={seller.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {seller.sellerInfo?.storeName ||
                      seller.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    📍 {seller.location?.city}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                {seller.sellerInfo?.storeDesc}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-yellow-400">
                  ⭐ {seller.sellerInfo?.rating}
                </span>

                <span className="text-pink-400">
                  {seller.followers?.length || 0} Followers
                </span>
              </div>

              <button className="w-full mt-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-2xl font-medium hover:opacity-90 transition">
                Follow Seller
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}