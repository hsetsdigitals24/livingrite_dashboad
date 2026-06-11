export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-4 text-gray-600">
          You don’t have permission to access this page.
        </p>
        <a href="/" className="mt-6 inline-block text-blue-600 underline">
          Go back home
        </a>
      </div>
    </div>
  );
}
