import React from 'react';

interface NeonCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon?: React.ReactNode;
  color?: 'default' | 'danger' | 'warning' | 'success';
  className?: string;
}

const NeonCard: React.FC<NeonCardProps> = ({ title, value, unit, subValue, icon, color = 'default', className = '' }) => {
  
  let borderColor = 'border-[#00708f]';
  let shadowColor = 'shadow-[#00708f]';
  let textColor = 'text-[#00c2f7]';

  if (color === 'danger') {
    borderColor = 'border-red-600';
    shadowColor = 'shadow-red-600';
    textColor = 'text-red-500';
  } else if (color === 'warning') {
    borderColor = 'border-yellow-500';
    shadowColor = 'shadow-yellow-500';
    textColor = 'text-yellow-400';
  } else if (color === 'success') {
    borderColor = 'border-green-500';
    shadowColor = 'shadow-green-500';
    textColor = 'text-green-400';
  }

  return (
    <div className={`relative bg-[#1e1e1e] border-2 ${borderColor} rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,112,143,0.4)] ${className}`}>
      {/* Header */}
      <div className="w-full flex justify-between items-start mb-2">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</span>
        {icon && <div className={`${textColor} opacity-80`}>{icon}</div>}
      </div>

      {/* Main Value */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex items-baseline">
            <span className={`text-3xl font-bold font-tech ${textColor} drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]`}>
            {value}
            </span>
            {unit && <span className="text-gray-500 text-sm ml-1">{unit}</span>}
        </div>
      </div>

      {/* Footer Info */}
      {subValue && (
        <div className="w-full text-center mt-2 pt-2 border-t border-gray-800">
          <span className="text-xs text-gray-400">{subValue}</span>
        </div>
      )}
    </div>
  );
};

export default NeonCard;