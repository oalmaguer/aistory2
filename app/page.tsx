"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { saveStory } from "@/lib/supabase";

export default function Home() {
  const [story, setStory] = useState(
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis culpa eaque ipsa, perspiciatis accusantium amet consequatur similique est veritatis iusto, inventore quidem suscipit, obcaecati quos quo iste tenetur? Vel, neque."
  );
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isRandomPromptLoading, setIsRandomPromptLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [showStory, setShowStory] = useState(false);
  const [title, setTitle] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate a story");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();

      generateImage(data.prompt_for_image);
      // generateVoice(data.story);
      setStory(data.story);
      setTitle(data.title);
    } catch (err) {
      setError("Failed to generate voice. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoice = async (story: string) => {
    setIsVoiceLoading(true);
    try {
      const response = await fetch("/api/genvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story }),
      });

      console.log("response from voice", response);

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();
      setVoiceUrl(data.audio);
    } catch (error) {
      console.error("Failed to generate voice:", error);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    setIsImageLoading(true);
    try {
      const response = await fetch("/api/genimage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();
      setImageUrl(data);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const genRandomPrompt = async () => {
    setIsRandomPromptLoading(true);
    try {
      const randomPrompt = await fetch("/api/randomprompt", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!randomPrompt.ok) {
        throw new Error("Failed to generate story");
      }
      const data = await randomPrompt.json();

      setPrompt(data.choices[0].message.content);
    } catch (error) {
      console.error("Failed to generate random prompt:", error);
    } finally {
      setIsRandomPromptLoading(false);
    }
  };

  const saveUserStory = async (story: any) => {
    await saveStory(story, title, prompt, imageUrl);
  };

  return (
    <div className="min-h-screen bg-black text-red-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[600px] min-h-screen border-l border-red-900/30 bg-black/50 backdrop-blur-sm">
          <div className="sticky top-0 p-8 max-h-screen overflow-y-auto">
            <div className="space-y-8">
              <form onSubmit={generateStory} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="prompt"
                    className="scroll-m-20 text-1xl font tracking-tight lg:text-xl"
                  >
                    Enter your nightmare...
                  </label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 bg-black/50 text-gray-200 p-4 rounded-lg border"
                    placeholder="Describe your darkest fears..."
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="button"
                  onClick={() => genRandomPrompt()}
                  disabled={isRandomPromptLoading}
                  className="w-10 bg-red-900 hover:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <span className={isRandomPromptLoading ? "animate-spin" : ""}>
                    🎲
                  </span>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || prompt.trim().length === 0}
                  className="w-full tracking-tight"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Summoning Horror...
                    </>
                  ) : (
                    "Generate Story"
                  )}
                </Button>
                {isImageLoading ? (
                  <div className="w-full aspect-video">
                    <Skeleton className="w-full h-full rounded-lg bg-gray-800/50" />
                  </div>
                ) : (
                  imageUrl && (
                    <img
                      onClick={() => window.open(imageUrl, "_blank")}
                      src={imageUrl}
                      alt="horror story"
                      className="w-full h-auto rounded-lg"
                    />
                  )
                )}
              </form>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 pb-20 sm:p-20">
          <div className="max-w-3xl mx-auto">
            <header className="text-center mb-16">
              <h1 className="scroll-m-5 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Horror Story Creator
              </h1>
              {!story && !isLoading && (
                <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
                  Welcome to Horror Story Creator, where your darkest
                  imaginations come to life. Venture into the depths of terror
                  as our AI crafts personalized tales of horror that will send
                  chills down your spine. Dare to explore the shadows that lurk
                  in the corners of your mind?
                </p>
              )}
              {(story || isLoading) && (
                <div className="mt-8 space-y-4">
                  {/* save story icon */}
                  <Button
                    type="button"
                    onClick={() => saveUserStory(story)}
                    disabled={false}
                    className="bg-green-700 tracking-tight"
                    color="white"
                  >
                    Save Story
                  </Button>

                  <h2 className="text-xl font-semibold text-red-500">
                    {story && title ? title : "Your Tale of Horror"}
                  </h2>
                  {isVoiceLoading ? (
                    <Skeleton className="w-full h-12 rounded-lg bg-gray-800/50" />
                  ) : (
                    voiceUrl && (
                      <audio controls className="w-full h-auto rounded-lg">
                        <source
                          src={`data:audio/mpeg;base64,${voiceUrl}`}
                          type="audio/mpeg"
                        />
                      </audio>
                    )
                  )}
                  <div className="bg-black/50 p-6 rounded-lg border border-red-900/30 prose prose-invert prose-red">
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="w-full h-6 bg-gray-800/50" />
                        <Skeleton className="w-[90%] h-6 bg-gray-800/50" />
                        <Skeleton className="w-[95%] h-6 bg-gray-800/50" />
                        <Skeleton className="w-[85%] h-6 bg-gray-800/50" />
                      </div>
                    ) : (
                      <p className="text-gray-300 text-2xl leading-relaxed whitespace-pre-wrap">
                        {story}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </header>
          </div>
        </main>
      </div>
    </div>
  );
}
