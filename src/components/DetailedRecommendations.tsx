import React from 'react';
import { Recommendation } from '../types/evaluation';

interface DetailedRecommendationsProps {
  data: Recommendation[];
}

const DetailedRecommendations: React.FC<DetailedRecommendationsProps> = ({ data }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-100 text-red-800';
      case 'P2':
        return 'bg-yellow-100 text-yellow-800';
      case 'P3':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {data.map((recommendation) => (
        <div
          key={recommendation.id}
          className="p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {recommendation.category}
            </h3>
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(
                recommendation.priority
              )}`}
            >
              {recommendation.priority}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{recommendation.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500">Impact:</span>
              <p className="text-gray-700">{recommendation.impact}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Coût estimé:</span>
              <p className="text-gray-700">{recommendation.estimatedCost}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Délai:</span>
              <p className="text-gray-700">{recommendation.timeline}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedRecommendations;
