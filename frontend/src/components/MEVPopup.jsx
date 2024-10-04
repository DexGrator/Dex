import React, { useState } from "react";
import { Info, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Popup from "./Popup";

export default function MEVPopup({ onClose, onMEVProtectionChange }) {
  const [mevProtection, setMEVProtection] = useState(true);

  const handleMEVProtectionChange = (checked) => {
    setMEVProtection(checked);
    onMEVProtectionChange(checked);
  };

  return (
    <Popup title="MEV Protection" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-start space-x-2">
          <ShieldCheck size={24} className="text-[#03e1ff] mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-1">What is MEV Protection?</h3>
            <p className="text-gray-400 text-sm">
              MEV protection helps prevent your transaction from being frontrun or sandwiched by miners or other traders.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-white">Enable MEV Protection</span>
            <Info size={16} className="text-gray-400" />
          </div>
          <Switch checked={mevProtection} onCheckedChange={handleMEVProtectionChange} />
        </div>

        <div className="bg-[#1E1E1E] rounded-lg p-4">
          <p className="text-white text-sm mb-2">
            MEV Protection is currently{" "}
            <span className={mevProtection ? "text-[#03e1ff]" : "text-red-500"}>
              {mevProtection ? "enabled" : "disabled"}
            </span>
          </p>
          <p className="text-gray-400 text-xs">
            {mevProtection
              ? "Your transaction will be protected from frontrunning and sandwiching attacks."
              : "Your transaction may be vulnerable to frontrunning and sandwiching attacks."}
          </p>
        </div>
      </div>
    </Popup>
  );
}