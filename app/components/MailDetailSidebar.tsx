

"use client";
import { X } from "lucide-react";
export interface Email {
  id: string;
  snippet: string;
  labelIds: string[];
  category:string
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

        <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
          {/* <p><strong>Mail ID:</strong> {email.id}</p> */}
          <p>{email.labelIds.filter((label) => label.startsWith("CATEGORY_"))}</p>
          <p>{email.snippet}</p>

          <div className="mt-4">
          <h3 className="font-semibold mb-2 text-gray-700">Email Body:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {email.bodyText || "No content available."}
          </p>
        </div>

          {/* <p className="mt-2">You can show classification results or details here.</p> */}
        </div>
      </div>
    </>
  );
}
