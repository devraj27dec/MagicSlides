
import React from "react";

interface EmailSkeletonProps {
  count?: number;
}

const EmailSkeleton: React.FC<EmailSkeletonProps> = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <li
          key={idx}
          className="border rounded-lg p-4 shadow-sm bg-gray-100 animate-pulse mb-3"
        >
          <div className="flex justify-between items-center mb-2 gap-2">
            <span className="h-4 w-20 bg-gray-300 rounded-full"></span>
            <span className="h-4 w-16 bg-gray-300 rounded-full"></span>
          </div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </li>
      ))}
    </>
  );
};

export default EmailSkeleton;
