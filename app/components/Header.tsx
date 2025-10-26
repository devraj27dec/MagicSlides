"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Mail } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  // console.log("session", session);

  return (
    <div className="border rounded-full py-2 px-4 flex justify-between items-center mx-auto">
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <span className="text-xl font-bold">MagicSlides</span>
      </div>
      <div>
        {status === "loading" ? (
          <span>Loading...</span>
        ) : session ? (
          <div className="flex items-center gap-3">
            <span className="text-white">{session.user?.name}</span>
            <button
              className="p-2 bg-red-600 rounded-md text-white"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="p-2 bg-blue-600 hover:bg-blue-700  rounded-md text-sm text-white"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
