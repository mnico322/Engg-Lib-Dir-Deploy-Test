import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // adjust path if needed

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">
          Digital Institutional Repository
        </h1>
        <p className="text-gray-700 mb-6">
          This system stores, filters, and manages institutional records. Guests can view records; admins and librarians have full access.
        </p>

        {!currentUser && (
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-[#ff8400] hover:bg-[#FF9D33] text-white font-semibold px-6 py-2 rounded transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-[#ff8400] hover:border-[#FF9D33] text-[#ff8400] font-semibold px-6 py-2 rounded transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
