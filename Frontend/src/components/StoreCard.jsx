import React from 'react';

const StoreCard = ({ store, onClick }) => {
  return (
    <div
      className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-white"
      onClick={() => onClick(store)}
    >
      <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
      <p className="text-sm text-gray-600">{store.address}</p>

      <div className="mt-2 flex items-center space-x-2">
        <p className="text-sm text-gray-700">Avg Rating:</p>
        <span className="font-medium text-yellow-500">
          {store.avgRating?.toFixed(1) || 'N/A'} ★
        </span>
        <span className="text-xs text-gray-500">
          ({store.totalRatings || 0} ratings)
        </span>
      </div>
    </div>
  );
};

export default StoreCard;
