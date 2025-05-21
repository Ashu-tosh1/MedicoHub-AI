/* eslint-disable @next/next/no-html-link-for-pages */
const UnauthorizedPage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
          <p className="text-gray-700">You don&#39;t have permission to access this page. This area is restricted to patients only.</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Back to Home
          </a>
        </div>
      </div>
    );
  };
  
  export default UnauthorizedPage;
  