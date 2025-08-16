import React from 'react';
import { ChefHat, ShoppingBag } from 'lucide-react';

const ModeSwitch = ({ currentMode, onModeChange }) => {
  const modes = [
    {
      id: 'restaurant',
      name: 'Restaurant',
      nameAr: 'Restaurant',
      icon: ChefHat,
      color: 'bg-orange-500',
      description: 'Restaurant POS System'
    },
    {
      id: 'retail',
      name: 'Retail',
      nameAr: 'Retail',
      icon: ShoppingBag,
      color: 'bg-blue-500',
      description: 'Retail POS System'
    }
  ];

  return (
    <div className="mode-switch-container">
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? `${mode.color} text-white shadow-md`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
              title={mode.description}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{mode.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSwitch;