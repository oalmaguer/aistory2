"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser, getSession } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      const session = await getSession();

      console.log(user, session);
      if (session) {
        router.push("/profile");
      }
    };

    checkUser();
  }, []);

  const submitForm = async (status: string) => {
    if (status === "login") {
      await login();
    } else {
      await signUp();
    }
  };

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      setError(error.message);
    }
    if (data?.session) {
      router.push("/profile");
    }
  };

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      console.log(error);
    }
    if (data?.session) {
      router.push("/profile");
    }
  };

  const [status, setStatus] = useState("login");
  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-zinc-900/90 rounded-lg border border-zinc-800">
      <h1 className="text-2xl font-bold mb-6 text-white">
        {status === "login" ? "Login" : "Sign Up"}
      </h1>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 bg-zinc-800 border-zinc-700 text-white rounded-md placeholder-gray-500"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 bg-zinc-800 border-zinc-700 text-white rounded-md placeholder-gray-500"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <button
          onClick={() => submitForm(status === "login" ? "login" : "signup")}
          type="button"
          className="w-full bg-red-900 text-white p-2 rounded-md hover:bg-red-800 transition-colors"
        >
          {status === "login" ? "Login" : "Sign Up"}
        </button>
        <button
          onClick={() => setStatus(status === "login" ? "signup" : "login")}
          type="button"
          className="w-full bg-green-900 text-white p-2 rounded-md hover:bg-green-800 transition-colors"
        >
          {status === "login" ? "Sign Up" : "Login"}
        </button>
      </form>
    </div>
  );
}
