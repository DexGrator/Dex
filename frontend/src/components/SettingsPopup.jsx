import React, { useState } from "react";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import Popup from "./Popup";

export default function SettingsPopup({ onClose, onSettingsChange }) {
  const [gasPrice, setGasPrice] = useState(50);
  const [gasPreset, setGasPreset] = useState("normal");
  const [deadline, setDeadline] = useState(30);
  const [expertMode, setExpertMode] = useState(false);

  const handleGasPriceChange = (value) => {
    setGasPrice(value[0]);
    onSettingsChange({ gasPrice: value[0] });
  };

  const handleGasPresetClick = (preset) => {
    setGasPreset(preset);
    // Set a predefined gas price based on the preset
    const presetValues = { normal: 50, fast: 75, instant: 100 };
    setGasPrice(presetValues[preset]);
    onSettingsChange({ gasPrice: presetValues[preset], gasPreset: preset });
  };

  const handleDeadlineChange = (e) => {
    const value = parseInt(e.target.value);
    setDeadline(value);
    onSettingsChange({ deadline: value });
  };

  const handleExpertModeChange = (checked) => {
    setExpertMode(checked);
    onSettingsChange({ expertMode: checked });
  };

  return (
    <Popup title="Settings" onClose={onClose}>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white">Gas Price</span>
            <div className="flex items-center space-x-2">
              {["normal", "fast", "instant"].map((preset) => (
                <button
                  key={preset}
                  className={`text-xs rounded-full px-3 py-1 ${
                    gasPreset === preset ? "bg-[#03e1ff] text-black" : "bg-[#1E1E1E] text-[#03e1ff]"
                  }`}
                  onClick={() => handleGasPresetClick(preset)}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <Slider
            value={[gasPrice]}
            onValueChange={handleGasPriceChange}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-white text-sm mt-1">Current: {gasPrice} GWEI</div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white">Transaction deadline</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="bg-[#1E1E1E] text-white text-sm rounded-lg px-3 py-1 w-16"
                value={deadline}
                onChange={handleDeadlineChange}
                min={1}
                max={4320}
              />
              <span className="text-white text-sm">minutes</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-white">Expert Mode</span>
            <Info size={16} className="text-gray-400" />
          </div>
          <Switch checked={expertMode} onCheckedChange={handleExpertModeChange} />
        </div>
      </div>
    </Popup>
  );
}