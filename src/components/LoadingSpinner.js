import React from "react";

const LoadingSpinner = ({ size = "lg", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
    xl: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-2 text-center">
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses[size]}`}
      />
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
