import React from "react";

const CourseCardSkeleton = () => {
  return (
    <div className="bg-tertiaryBg rounded-xl overflow-hidden shadow-lg h-full animate-pulse">
      <div className="w-full aspect-video bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
