"use client";

import React, { useState } from "react";
import Image from "next/image";

interface UserDropdownProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatarSize?: number; 
  onLogout?: () => void;
}


const UserDropdown: React.FC<UserDropdownProps> = ({
  name,
  email,
  image,
  avatarSize = 40,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
      >
       <Image
        src={image || "/default-avatar.png"} 
        alt={name || "User avatar"}
        width={40}
        height={40}
        className="rounded-full"
      />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
          {(name || email) && (
            <div className="px-4 py-3">
              {name && <p className="text-sm text-gray-700 dark:text-gray-200">{name}</p>}
              {email && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</p>}
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700 dark:text-white rounded-b-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
