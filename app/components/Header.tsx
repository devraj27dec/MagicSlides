"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  // console.log("session", session);

  return (
    <div className="border rounded-full py-2 px-4 flex justify-between items-center mx-auto">
      <div className="text-xl font-semibold">MagicSlides</div>
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
            className="p-2 bg-blue-600 rounded-md text-sm text-white"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
