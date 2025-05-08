import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const HelpPopup = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-white">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Turnspire Quick Start</Dialog.Title>
            <button onClick={onClose} aria-label="Close">
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
          <div className="space-y-3 text-sm leading-relaxed">
            <p><strong>1. Add Characters and Enemies:</strong> Use the forms on the left to add PCs and enemies with names, HP, and initiative.</p>
            <p><strong>2. Move Tokens:</strong> Drag tokens on the grid to position them. Blue = PCs, Red = Enemies, Gray = Defeated.</p>
            <p><strong>3. Track Effects:</strong> Click a token and use the Conditions/Concentration panels to apply or remove effects.</p>
            <p><strong>4. Next Turn:</strong> Click <span className="bg-green-600 px-1 rounded">Next Turn</span> to cycle through initiative and rounds.</p>
            <p><strong>5. Spell Markers:</strong> Add, drag, rotate, and delete area effects like cones or spheres.</p>
            <p><strong>6. Save & Load:</strong> Save your encounter to a file or load a saved scenario.</p>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Got it!
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default HelpPopup;
