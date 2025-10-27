"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowDropupCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { FaSearchPlus } from "react-icons/fa";
import MailDetailSidebar, { Email } from "./MailDetailSidebar";
import { getCategoryColor } from "../lib";
import EmailSkeleton from "./EmailSkeleton";



export default function Mails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailCount, setEmailCount] = useState(3);
  const [open , setOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { data: session, status } = useSession();
  const [Loading , setLoading] = useState(false)
  const token = session?.accessToken;


  useEffect(() => {
  if (status !== "authenticated" || !token) return;

  const fetchEmails = async () => {
    try {
      setLoading(true)
      // console.log("Fetching emails");

      const listResponse = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${emailCount}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!listResponse.data.messages) {
        console.log("No messages found.");
        return;
      }

      const messages = await Promise.all(
        listResponse.data.messages.map(async (msg: { id: string }) => {
          const detailResponse = await axios.get(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const message = detailResponse.data;

          return {
            id: message.id,
            snippet: message.snippet,
            labelIds: message.labelIds ?? [],
            category: "Loading...",
          };
        })
      );


      setEmails(messages);

      messages.forEach(async (msg, index) => {
        try {
          const res = await fetch("/api/classify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailText: msg.snippet }),
          });
          const data = await res.json();
          const category = data.category || "General";

          setEmails((prev) => {
            const copy = [...prev];
            copy[index].category = category;
            return copy;
          });
        } catch (err) {
          console.error("Classification error:", err);
          setEmails((prev) => {
            const copy = [...prev];
            copy[index].category = "General";
            return copy;
          });
        }
      });
    } catch (error: any) {
      console.error("Error fetching emails:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.log("Token expired 😭.");
      }
    } finally {
      setLoading(false)
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


  if (status !== "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl mb-4">Please sign in to view your emails</h2>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center bg-[linear-gradient(187deg,rgba(255,255,255,1)_0%,rgba(21,93,252,1)_63%)] bg-clip-text text-transparent">Gmail Messages</h1>
      {/* {!session && <p>Please sign in to view emails.</p>} */}

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
        {Loading ? (
          <EmailSkeleton count={emailCount}/>
        ) : (
          <>
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
          
          </>
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
