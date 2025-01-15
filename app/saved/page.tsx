"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { saveStory } from "@/lib/supabase";

export default function SavedStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("stories").select("*");
      if (error) {
        throw new Error("Failed to fetch stories");
      }
      setStories(data);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStories();
  }, []);
  return <div className="min-h-screen bg-black text-red-50"></div>;
}
