import React, { useState, useEffect } from 'react';
import { Goals } from '../types';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: Goals) => void;
  currentGoals: Goals;
}

const GoalsModal: React.FC<GoalsModalProps> = ({ isOpen, onClose, onSave, currentGoals }) => {
  const [goals, setGoals] = useState<Goals>(currentGoals);

  useEffect(() => {
    setGoals(currentGoals);
  }, [currentGoals]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
        weekly: Number(goals.weekly) || 0,
        monthly: Number(goals.monthly) || 0,
        yearly: Number(goals.yearly) || 0
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoals(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl shadow-lg p-8 w-full max-w-md transform transition-transform duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">Set Your Goals</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="weekly" className="block text-sm font-medium text-gray-300 mb-1">Weekly Hours Goal</label>
                <input type="number" name="weekly" id="weekly" value={goals.weekly} onChange={handleChange} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500"/>
            </div>
            <div>
                <label htmlFor="monthly" className="block text-sm font-medium text-gray-300 mb-1">Monthly Hours Goal</label>
                <input type="number" name="monthly" id="monthly" value={goals.monthly} onChange={handleChange} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500"/>
            </div>
            <div>
                <label htmlFor="yearly" className="block text-sm font-medium text-gray-300 mb-1">Yearly Hours Goal</label>
                <input type="number" name="yearly" id="yearly" value={goals.yearly} onChange={handleChange} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500"/>
            </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-white text-black font-semibold transition-colors duration-200 hover:bg-gray-200">Save Goals</button>
        </div>
      </div>
    </div>
  );
};

export default GoalsModal;