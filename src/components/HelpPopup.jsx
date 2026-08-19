import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const HelpPopup = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="panel mx-auto max-h-[85vh] max-w-lg overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Welcome to Turnspire</Dialog.Title>
            <button onClick={onClose} aria-label="Close">
              <X className="w-6 h-6 text-slate-400 hover:text-white" />
            </button>
          </div>
          <div className="space-y-4 text-sm leading-relaxed">
            <p><strong>⚔️ Add Characters & Enemies:</strong> Use the forms to add combatants with name, HP, AC, and Initiative. Grouped enemies share initiative.</p>
            <p><strong>🗺️ Use the Grid:</strong> Drag tokens to place them. Blue = PC, Red = Enemy, Gray = Defeated.</p>
            <p><strong>🔄 Turn Order:</strong> Use <span className="tag bg-emerald-700 text-white">Next Turn</span> to rotate through initiative. Rounds increase automatically.</p>
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
            <p><strong>↩️ Undo:</strong> Made a mistake? Use the <span className="tag">Undo</span> button or press Ctrl+Z to roll back your last action.</p>
            <p><strong>☕ Support the Project:</strong> Enjoying Turnspire? Click the Ko-fi button to buy me a potion.</p>
            <p><strong>📬 Need Help?</strong> Email <a href="mailto:turnspire@gmail.com" className="text-blue-400 underline">turnspire@gmail.com</a>.</p>
            <p><strong>🐉 Monster Search:</strong> Type a creature name in the Add Enemies panel to pull its HP, AC, and initiative bonus from the SRD. Every field stays editable, so you can tweak a stat block or ignore the search entirely for homebrew.</p>
            <p className="pt-2 text-xs text-slate-500">
              Monster data from <a href="https://open5e.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Open5e</a>, drawn from the System Reference Document 5.2 by Wizards of the Coast, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">CC BY 4.0</a>.
            </p>
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="btn btn-primary"
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
