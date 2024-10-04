import React from 'react';
import { X } from 'lucide-react';

export default function Popup({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#11101e] rounded-[20px] p-6 w-[350px] max-h-[80vh] overflow-y-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
