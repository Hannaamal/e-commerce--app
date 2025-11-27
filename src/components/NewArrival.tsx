export default function NewArrival() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="mb-8">
        <p className="text-red-500 font-medium">Featured</p>
        <h2 className="text-3xl font-bold">New Arrival</h2>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left Big Card */}
        <div className="relative rounded-xl overflow-hidden shadow">
          <img
            src="images/Screenshot 2025-10-27 100250.png"
            className="w-full h-[430px] object-cover"
          />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-semibold">PlayStation 5</h3>
            <p className="text-sm w-60">
              Black and White version of the PS5 coming out on sale.
            </p>
            <button className="mt-3 bg-white text-black px-4 py-1 rounded">
              Shop Now
            </button>
          </div>
        </div>

        {/* Right Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Top Right Card */}
          <div className="relative rounded-xl overflow-hidden shadow">
            <img
              src="/images/beauty-photography-trends-2024-FI-683x1024.jpeg"
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-semibold">Women’s Collections</h3>
              <p className="text-sm w-56">
                Featured woman collections that give you another vibe.
              </p>
              <button className="mt-3 bg-white text-black px-4 py-1 rounded">
                Shop Now
              </button>
            </div>
          </div>

          {/* Bottom Cards Row */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Speakers */}
            <div className="relative rounded-xl overflow-hidden shadow">
              <img
                src="/images/hunyhuny-premium-rocking-glider-nursing-armchair-ottoman-cum-footstool-set-in-beige-colour.jpg"
                className="w-full h-[200px] object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Furnitures</h3>
                <p className="text-sm">Simple and Elegent Furniture</p>
                <button className="mt-2 bg-white text-black px-4 py-1 rounded">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Perfume */}
            <div className="relative rounded-xl overflow-hidden shadow">
              <img
                src="/images/pexels-rethaferguson-3059609.jpg"
                className="w-full h-[200px] object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Perfume</h3>
                <p className="text-sm">GUCCI INTENSE-OUD EDP</p>
                <button className="mt-2 bg-white text-black px-4 py-1 rounded">
                  Shop Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Row */}
      <div className="grid md:grid-cols-3 gap-10 mt-16 text-center">
        
        <div>
          <div className="text-4xl mb-3">🚚</div>
          <h4 className="font-semibold">FREE AND FAST DELIVERY</h4>
          <p className="text-sm">Free delivery for all orders over $140</p>
        </div>

        <div>
          <div className="text-4xl mb-3">🎧</div>
          <h4 className="font-semibold">24/7 CUSTOMER SERVICE</h4>
          <p className="text-sm">Friendly 24/7 customer support</p>
        </div>

        <div>
          <div className="text-4xl mb-3">✔️</div>
          <h4 className="font-semibold">MONEY BACK GUARANTEE</h4>
          <p className="text-sm">We return money within 30 days</p>
        </div>

      </div>
    </div>
  );
}
