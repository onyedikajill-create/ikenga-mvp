export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        
        {/* Simple Gold Text Logo */}
        <div className="mb-8">
          <span className="text-5xl font-bold text-[#FFD700] tracking-tight drop-shadow-lg">
            IKENGA
          </span>
        </div>
        
        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          Power Your Destiny<br />
          <span className="text-[#FFD700]">Across Every Platform</span>
        </h1>
        
        <p className="mb-8 max-w-2xl text-xl text-gray-300">
          IKENGA AI — Creative Intelligence for Brands, Agencies, and Creators
        </p>
        
        <button className="rounded-lg bg-[#FFD700] px-8 py-3 text-lg font-semibold text-black transition hover:bg-yellow-500">
          Start Free — No Credit Card Required
        </button>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-black/50 p-6">
            <h3 className="mb-2 text-xl font-semibold text-[#FFD700]">AI Content Engine</h3>
            <p className="text-gray-400">Generate posts in seconds</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-black/50 p-6">
            <h3 className="mb-2 text-xl font-semibold text-[#FFD700]">Brand Voice Training</h3>
            <p className="text-gray-400">Your tone, perfectly replicated</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-black/50 p-6">
            <h3 className="mb-2 text-xl font-semibold text-[#FFD700]">Multi-Platform Publishing</h3>
            <p className="text-gray-400">LinkedIn, Twitter, Instagram</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-black/50 p-6">
            <h3 className="mb-2 text-xl font-semibold text-[#FFD700]">Analytics Dashboard</h3>
            <p className="text-gray-400">Measure what resonates</p>
          </div>
        </div>

        {/* Email Capture */}
        <div className="mt-16 w-full max-w-md">
          <h3 className="mb-4 text-2xl font-semibold text-[#FFD700]">Get Early Access</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
            <button className="rounded-lg bg-[#FFD700] px-6 py-2 font-semibold text-black transition hover:bg-yellow-500">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pb-8 text-sm text-gray-500">
          © 2026 IKENGA AI. Power Your Destiny Across Every Platform.
        </footer>
      </div>
    </main>
  );
}