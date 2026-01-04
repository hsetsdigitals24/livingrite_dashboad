export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">LivingRite Portal</h1>
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="inline-block px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Sign In
            </a>
            <a
              href="/auth/register"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Care Management Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Secure portal for families to stay connected with their loved ones' care.
          </p>
          <a
            href="/auth/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
