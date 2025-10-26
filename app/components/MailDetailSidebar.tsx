"use client";
import { X } from "lucide-react";
import { getCategoryColor } from "../lib";

export interface Email {
  id: string;
  snippet: string;
  labelIds: string[];
  category: string;
}

type MailSidebarProps = {
  email: Email;
  onOpen: boolean;
  onOpenChange: () => void;
};

export default function MailDetailSidebar({
  email,
  onOpen,
  onOpenChange,
}: MailSidebarProps) {
  return (
    <>
      {onOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onOpenChange}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[650px] bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
          onOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Mail Detail
          </h2>
          <button
            onClick={onOpenChange}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xl text-white">
              {email.labelIds
                .filter((label) => label.startsWith("CATEGORY_"))
                .join(", ")}
            </p>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full border ${getCategoryColor(
                email.category
              )}`}
            >
              {email.category}
            </span>
          </div>

          {/* Snippet below */}
          <p className="text-sm text-gray-100">{email.snippet}</p>
        </div>
      </div>
    </>
  );
}
