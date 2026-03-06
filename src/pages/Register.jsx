import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false); // Added loading state for UX
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // 1. Basic Validation
    if (!form.email.endsWith("@up.edu.ph")) {
      setError('Email must end with "@up.edu.ph"');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // 2. Call the register function from AuthContext
      await register(form.displayName, form.email, form.password);

      // 3. Success handling
      toast.success("Account registered! Please wait for admin approval.", {
        duration: 5000,
      });
      navigate("/login");
    } catch (err) {
      // 4. Enhanced Error Handling
      // This pulls the "Email already registered" or other messages from your Express routes
      const serverMessage = err.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration Error:", serverMessage);
      setError(serverMessage);
      toast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Display Name</label>
            <input
              type="text"
              name="displayName"
              required
              value={form.displayName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ff8400] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="username@up.edu.ph"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ff8400] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ff8400] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ff8400] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded font-semibold transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#ff8400] hover:bg-[#FF9D33]"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span 
            onClick={() => navigate("/login")} 
            className="text-[#ff8400] cursor-pointer hover:underline font-medium"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}