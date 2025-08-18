import React from "react";

const Badge = ({ children, variant = "secondary", className = "" }) => {
  const variants = {
    secondary: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
    destructive: "bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-400",
    warning: "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400"
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${variants[variant] || variants.secondary} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
