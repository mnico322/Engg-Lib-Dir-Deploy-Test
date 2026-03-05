// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#ff8400] text-white text-center py-3 mt-6">
      <p className="text-sm">
        © {new Date().getFullYear()} UP College of Engineering Libraries. All rights reserved.
      </p>
    </footer>
  );
}
