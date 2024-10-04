import React, { useState } from "react";
import { Info } from "lucide-react";
import Popup from "./Popup";

export default function SlippagePopup({ onClose, onSlippageChange }) {
  const [slippage, setSlippage] = useState("auto");
  const [customSlippage, setCustomSlippage] = useState("");
  const [error, setError] = useState("");

  const handleSlippageClick = (value) => {
    setSlippage(value);
    setCustomSlippage("");
    setError("");
    onSlippageChange(value);
  };

  const handleCustomSlippageChange = (e) => {
    const value = e.target.value;
    setCustomSlippage(value);
    setSlippage("custom");

    if (value === "" || isNaN(value)) {
      setError("Please enter a valid number");
    } else if (parseFloat(value) < 0.1) {
      setError("Slippage too low");
    } else if (parseFloat(value) > 5) {
      setError("Slippage too high");
    } else {
      setError("");
      onSlippageChange(parseFloat(value));
    }
  };

  return (
    <Popup title="Slippage tolerance" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info size={16} className="text-gray-400" />
          <p className="text-gray-400 text-sm">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </p>
        </div>

        <div className="flex space-x-2">
          {["auto", "0.1", "0.5", "1"].map((value) => (
            <button
              key={value}
              className={`text-sm rounded-full px-4 py-2 flex-1 ${
                slippage === value ? "bg-[#03e1ff] text-black" : "bg-[#1E1E1E] text-[#03e1ff]"
              }`}
              onClick={() => handleSlippageClick(value)}
            >
              {value === "auto" ? "Auto" : `${value}%`}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="number"
            className={`w-full bg-[#1E1E1E] text-white text-sm rounded-full px-4 py-2 pr-8 ${
              slippage === "custom" ? "border-2 border-[#03e1ff]" : ""
            }`}
            placeholder="Custom"
            value={customSlippage}
            onChange={handleCustomSlippageChange}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">%</span>
        </div>

        {error && <p className="text-yellow-500 text-sm">{error}</p>}
      </div>
    </Popup>
  );
}