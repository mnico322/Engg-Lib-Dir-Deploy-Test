// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Welcome to DIR2.0
        </h1>
        <p className="text-gray-700 mb-6">
          This system stores, filters, and manages institutional records. Guests can view records; admins and librarians have full access.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-semibold px-6 py-2 rounded transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}


/* export default function Home() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 underline">
        Tailwind CSS is Working! 🎉
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        If this text is styled, you're good to go.
      </p>
    </div>
  );
}
*/