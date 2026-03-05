import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, userData, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Wrap in useCallback to prevent the infinite loop crash
  const redirectByRole = useCallback((role) => {
    if (!role) return;
    switch (role) {
      case "admin":
        navigate("/admin", { replace: true });
        break;
      case "librarian":
        navigate("/records", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
        break;
    }
  }, [navigate]);


useEffect(() => {
 if (!loading && userData && window.location.pathname === "/login") {
    redirectByRole(userData.role);
  }
}, [userData, loading, redirectByRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(form.email, form.password);
      if (loggedInUser) {
        toast.success("Login successful!");
        redirectByRole(loggedInUser.role);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ff8400]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ff8400]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff8400] text-white py-2 rounded hover:bg-[#FF9D33]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}