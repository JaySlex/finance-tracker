import React from "react";

export default function CenteredPanel({ children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div
        className="
          bg-white 
          rounded-2xl 
          shadow-2xl 
          p-8 
          w-full 
          max-w-sm 
          min-w-[320px]
          flex flex-col
          items-stretch
          min-h-[320px]
          "
        style={{
          boxSizing: "border-box",
          // Enough minHeight for error/success messages and larger forms
          maxHeight: "95vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}
