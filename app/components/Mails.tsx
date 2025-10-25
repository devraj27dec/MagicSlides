
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


interface Email {
  id: string;
  snippet: string;
}

export default function Mails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const { data: session } = useSession();

  const token = session?.accessToken;
  console.log("token" , token)


  useEffect(() => {
    // if (!token) return;

    console.log("Hiii")
    const fetchEmails = async () => {
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      console.log("data 🚀🚀🚀", data)

      if (!data.messages) return;

      const emailsWithSnippets = await Promise.all(
        data.messages.map(async (msg: { id: string }) => {
          const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return await msgRes.json();
        })
      );

      setEmails(emailsWithSnippets);
    };

    fetchEmails();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gmail Messages</h1>
      <ul>
        {emails.map((email) => (
          <li key={email.id} className="border p-2 mb-2 rounded">
            <p><strong>Snippet:</strong> {email.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
