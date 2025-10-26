"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowDropupCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { FaSearchPlus } from "react-icons/fa";
import MailDetailSidebar, { Email } from "./MailDetailSidebar";
import { getCategoryColor } from "../lib";





export default function Mails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailCount, setEmailCount] = useState(3);
  const [open , setOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { data: session, status } = useSession();
  const token = session?.accessToken;


  
  useEffect(() => {
    if (status !== "authenticated" || !token) {
      return;
    }
    const fetchEmails = async () => {
      try {
        console.log("Fetching emails...");
        // 1. Get basic message list
        const listResponse = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${emailCount}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!listResponse.data.messages) {
          console.log("No messages found.");
          return;
        }
        console.log("response 🚨🚨", listResponse);
        

        const messages = await Promise.all(
          listResponse.data.messages.map(async (msg: { id: string }) => {
            const detailResponse = await axios.get(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          const message = detailResponse.data;
          console.log("message snippet" , message.snippet)

          const res = await fetch("/api/classify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailText: message.snippet}),
          });

          const data = await res.json();
          const category = data.category || "Other";

          return {
              id: message.id,
              snippet: message.snippet,
              labelIds: message.labelIds ?? [],
              category,
            };
          })
        );

        setEmails(messages);
      } catch (error: any) {
        console.error(
          "Error fetching emails:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          console.log("Token expired or unauthorized. Try re-signing in.");
        }
      }
    };
    fetchEmails();


    

  }, [status, token, emailCount]);

  const handleEmailClassiferIncCount = () => {
    setEmailCount((prev) => prev + 1);
  };

  const handleEmailClassiferDeccCount = () => {
    if (emailCount <= 1) return;
    setEmailCount((prev) => prev - 1);
  };

  const handleClassify = () => {
    setOpen(true)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center bg-[linear-gradient(187deg,rgba(255,255,255,1)_0%,rgba(21,93,252,1)_63%)] bg-clip-text text-transparent">Gmail Messages</h1>
      {!session && <p>Please sign in to view emails.</p>}

      <div className="flex justify-between text-white p-2 border mb-4">
        <div className="flex">
          <button
            className="rounded-md text-2xl"
            onClick={handleEmailClassiferIncCount}
          >
            <IoMdArrowDropupCircle />
          </button>
          <p className="text-xl p-2">{emailCount}</p>
          <button
            className="rounded-md text-2xl"
            onClick={handleEmailClassiferDeccCount}
          >
            <IoMdArrowDropdownCircle />
          </button>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-700 text-[16px] font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 hover:text-white transition-all duration-200 shadow-sm"
          onClick={handleClassify}
        >
          Classify
          <FaSearchPlus className="text-lg" />
        </button>
      </div>
      <ul>
        {emails?.length > 0 ? (
          emails.map((email) => (
            <li
              onClick={() => setSelectedEmail(email)}
              key={email.id}
              className={`border p-3 mb-3 rounded-lg shadow-sm transform transition duration-300 ease-in-out cursor-pointer
              ${
                selectedEmail?.id === email.id
                  ? "bg-blue-100 border-blue-400 scale-[1.02] shadow-md"
                  : "bg-gray-50 hover:shadow-md hover:scale-[1.02]" 
              }`}
            >
              <div className="flex justify-between gap-2 mb-2">
                {(email.labelIds ?? []).length > 0 && (
                  email.labelIds
                    .filter((label) => label.startsWith("CATEGORY_"))
                    .map((label) => {
                      return (
                        <span
                          key={label}
                          className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {label}{" "}
                        </span>
                      );
                    })
                )}
                {email.category && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${getCategoryColor(
                      email.category
                    )}`}
                  >
                    {email.category}
                  </span>
                )}
              </div> 
              
              <p className="text-sm text-gray-700">
                {email.snippet || "No content"}
              </p>
            </li> 
          ))
        ) : (
          <p className="text-gray-500 justify-center items-center text-3xl">
            No emails found 😔.
          </p>
        )}
      </ul>

      {selectedEmail && (
        <MailDetailSidebar
          email={selectedEmail}
          onOpen={open}
          onOpenChange={() => setOpen(false)}
        />
      )}
    </div>
  );
}
