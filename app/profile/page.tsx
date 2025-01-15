"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  getUser,
  getSession,
  signOut,
  globals,
  setUserStatus,
} from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setUserStatus();
    console.log(globals.user, globals.session);
    if (globals.user) {
      setUser(globals.user);
    }
    const fetchUser = async () => {
      const user = await getUser();
      console.log(user);
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
    };

    // fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();

    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-zinc-900/90 rounded-lg border border-zinc-800">
      <h1 className="text-2xl font-bold mb-6 text-white">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Name
          </label>

          <label className="block text-sm font-medium mb-1 text-gray-300">
            Email: {user?.email}
          </label>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-900 text-white p-2 rounded-md hover:bg-red-800 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
