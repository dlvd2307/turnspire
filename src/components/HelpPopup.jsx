import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const HelpPopup = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-white">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Welcome to Turnspire</Dialog.Title>
            <button onClick={onClose} aria-label="Close">
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>
          <div className="space-y-4 text-sm leading-relaxed">
            <p><strong>⚔️ Add Characters & Enemies:</strong> Use the forms to add combatants with name, HP, AC, and Initiative. Grouped enemies share initiative.</p>
            <p><strong>🗺️ Use the Grid:</strong> Drag tokens to place them. Blue = PC, Red = Enemy, Gray = Defeated.</p>
            <p><strong>🔄 Turn Order:</strong> Use <span className="bg-green-600 px-1 rounded">Next Turn</span> to rotate through initiative. Rounds increase automatically.</p>
            <p><strong>🧠 Track Effects:</strong> Apply or remove Conditions and Concentration via the panels or character details. Effects expire by round.</p>
            <p><strong>🧿 Token Highlights:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li><span className="text-green-400">Green Ring:</span> It's this character's turn</li>
              <li><span className="text-blue-400">Blue Ring:</span> Currently selected character</li>
              <li><span className="text-yellow-400">Yellow Ring:</span> Character has Conditions or Concentration</li>
            </ul>
            <p><strong>✨ Spell Markers:</strong> Use the form to add labeled shapes (cube, sphere, cone). Drag, rotate, or delete using the ❌ button.</p>
            <p><strong>🧮 Grid Settings:</strong> Adjust rows, columns, square size, and select a terrain background (grass, desert, dungeon, snow, town, or none).</p>
            <p><strong>🔃 Soft Reset:</strong> The Soft Reset button clears the board and combat state but keeps player characters and their current HP/AC. Use it to prep for a new encounter without re-adding your party.</p>
            <p><strong>💀 Death Saves:</strong> When a character hits 0 HP, use the manual +Success and +Failure buttons to track their death saves. 3 failures = dead. 3 successes = stable.</p>
            <p><strong>💾 Save & Load:</strong> Save your scenario to a file and load it later. Autosave keeps track of changes.</p>
            <p><strong>↩️ Undo:</strong> Made a mistake? Use the <span className="bg-yellow-600 px-1 rounded">Undo</span> button or press Ctrl+Z to roll back your last action.</p>
            <p><strong>☕ Support the Project:</strong> Enjoying Turnspire? Click the Ko-fi button to buy me a potion.</p>
            <p><strong>📬 Need Help?</strong> Email <a href="mailto:turnspire@gmail.com" className="text-blue-400 underline">turnspire@gmail.com</a>.</p>
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
