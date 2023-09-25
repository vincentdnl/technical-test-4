import React from "react";

const ProgressBar = ({ percentage, max, value }) => {
  const percentageColor = (p) => {
    if (p < 60) return { text: "text-[#fff]", bg: "bg-[#64b5f6]" };
    if (p < 70) return { text: "text-[#fff]", bg: "bg-[#ffb300]" };
    if (p < 80) return { text: "text-[#fff]", bg: "bg-[#fb8c00]" };
    if (p < 90) return { text: "text-[#fff]", bg: "bg-[#f4511e]" };
    if (p < 100) return { text: "text-[#fff]", bg: "bg-[#bf360c]" };
    if (p >= 100) return { text: "text-[#fff]", bg: "bg-[#1f0801]" };
  };

  return (
    // Progress Bar
    <div className="mb-6 mt-[25px] ">
      <div className={`w-full bg-gray-200 h-5 rounded-[10px] overflow-hidden ${percentage > 120 ? "animate-bounce" : ""}`}>
        <div className="bg-[#f00] rounded-[10px] " style={{ width: `${Math.min(100, percentage)}%` }}>
          <div
            className={`flex justify-center items-center h-5 text-[14px] font-medium 
            ${percentageColor(Math.round(percentage)).bg}
            ${percentageColor(Math.round(percentage)).text}
            rounded-[10px]`}
          />
        </div>
      </div>
      <div className="flex items-start justify-between text-sm">
        <div className="px-2 text-xs">{value.toFixed(2)}€</div>
        <div className="px-2">{percentage.toFixed(2)}%</div>
        <div className="px-2 text-xs">{max}€</div>
      </div>
    </div>
  );
};

export default ProgressBar;
