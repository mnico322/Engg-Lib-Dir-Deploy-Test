import React, { useState } from "react";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";

export default function ProfileSettings() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("No user is logged in.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // Update display name if changed
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update password if provided
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      toast.success("Profile updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Profile Settings
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="border p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border p-2 rounded w-full focus:ring-[#ff8400] focus:outline-none"
              placeholder="Enter your display name"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full focus:ring-[#ff8400] focus:outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded w-full focus:ring-[#ff8400] focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-[#ff8400] hover:bg-[#ff9d33] text-white px-4 py-2 rounded w-full transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
