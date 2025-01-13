"use client";
import { useState } from "react";
import Story from "./components/Story";

export default function Home() {
  const [story, setStory] = useState(``);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showStory, setShowStory] = useState(false);

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

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();

      generateImage(data.prompt_for_image);

      setStory(data.story);
    } catch (err) {
      setError("Failed to generate story. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
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
  };

  const genRandomPrompt = async () => {
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
    // setPrompt(res.);
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
                    className="block text-red-400 text-sm font-medium"
                  >
                    Enter your nightmare...
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 bg-black/50 text-gray-200 p-4 rounded-lg border border-red-900/30 focus:border-red-700 focus:ring-1 focus:ring-red-700 focus:outline-none resize-none placeholder:text-gray-600"
                    placeholder="Describe your darkest fears..."
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="button"
                  onClick={() => genRandomPrompt()}
                  className="w-10 bg-red-900 hover:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  🎲
                </button>
                <button
                  type="submit"
                  disabled={isLoading || prompt.trim().length === 0}
                  className="w-full bg-red-900 hover:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
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
                </button>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="horror story"
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </form>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 pb-20 sm:p-20">
          <div className="max-w-3xl mx-auto">
            <header className="text-center mb-16">
              <h1 className="text-6xl font-bold text-red-600 mb-8 tracking-wider">
                Horror Story Creator
              </h1>
              {!story && (
                <p className="text-2xl text-gray-400 leading-relaxed">
                  Welcome to Horror Story Creator, where your darkest
                  imaginations come to life. Venture into the depths of terror
                  as our AI crafts personalized tales of horror that will send
                  chills down your spine. Dare to explore the shadows that lurk
                  in the corners of your mind?
                </p>
              )}
              {story && (
                <div className="mt-8 space-y-4">
                  <h2 className="text-xl font-semibold text-red-500">
                    Your Tale of Horror
                  </h2>
                  <div className="bg-black/50 p-6 rounded-lg border border-red-900/30 prose prose-invert prose-red">
                    <p className="text-gray-300 text-2xl leading-relaxed whitespace-pre-wrap">
                      {story}
                    </p>
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
