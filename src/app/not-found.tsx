import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-[12rem] md:text-[15rem] leading-none font-bold text-amber-400 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-4">
        Page Not Found
      </h2>
      <p className="md:text-lg text-gray-300 mb-8 text-center">
        You have strayed from the path to your success.
      </p>
      <Link 
        href="/"
        className="text-lg font-semibold px-6 py-3 bg-amber-400 text-gray-800 rounded-lg hover:bg-amber-500 transition-color duration-200 ease-in-out"
      >
        Go to Homepage
      </Link>
    </div>
  );
}