
import React from 'react';
import { Check, X } from 'lucide-react';

interface PlanFeatureProps {
  name: string;
  included: boolean;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ name, included }) => {
  return (
    <div className="flex items-center">
      {included ? (
        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
      )}
      <span
        className={`text-sm ${
          included
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {name}
      </span>
    </div>
  );
};

export default PlanFeature;
