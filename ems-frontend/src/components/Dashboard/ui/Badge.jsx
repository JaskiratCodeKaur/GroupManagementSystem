import React from "react";

const Badge = ({ children, variant = "secondary", className = "" }) => {
  const variants = {
    secondary: "bg-gray-200 text-gray-700",
    destructive: "bg-red-200 text-red-800",
    warning: "bg-yellow-200 text-yellow-800"
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${variants[variant] || variants.secondary} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
