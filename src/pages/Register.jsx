import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Email domain check
    if (!form.email.endsWith('@up.edu.ph')) {
      setError('Email must end with "@up.edu.ph"');
      return;
    }

    // Password match check
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Set display name in Firebase Auth
      await updateProfile(userCred.user, {
        displayName: form.displayName
      });

      // Save user in Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        email: form.email,
        displayName: form.displayName,
        role: 'guest', // Default role
        approved: false,
      });

      toast.success('Account registered! Please wait for approval.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Failed to register. Please check your details.');
      toast.error('Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Create an Account</h2>

        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1 text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#ff8400] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@up.edu.ph"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#ff8400] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#ff8400] focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-[#ff8400] focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ff8400] text-white py-2 px-4 rounded hover:bg-[#FF9D33] transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
