"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

// Graffiti Canvas Component
function GraffitiCanvas({ onSave }: { onSave: (data: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#10b981"); // emerald-500
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
    
    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveCanvas();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveCanvas();
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvas();
  };

  const colors = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#000000"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition ${
                color === c ? "border-white scale-110" : "border-gray-600"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-300">Size:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-300">{lineWidth}px</span>
        </div>
        <button
          type="button"
          onClick={clearCanvas}
          className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full border-2 border-emerald-700 rounded-lg cursor-crosshair bg-white"
        style={{ maxWidth: "600px", aspectRatio: "3/2" }}
      />
      <p className="text-xs text-gray-400">
        ✏️ Draw or write anything! Use your mouse to create your graffiti.
      </p>
    </div>
  );
}

// Emoji Canvas Component
function EmojiCanvas({ onSave }: { onSave: (data: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emojis, setEmojis] = useState<Array<{ emoji: string; x: number; y: number }>>([]);
  const [selectedEmoji, setSelectedEmoji] = useState("😊");

  const emojiPalette = [
    "😊", "😂", "❤️", "🔥", "✨", "🎉", "👍", "🎵",
    "🌟", "💫", "🌈", "🦋", "🌸", "🍀", "⭐", "💖",
    "😎", "🤔", "😍", "🥳", "😇", "🤗", "😋", "🎨"
  ];

  useEffect(() => {
    renderCanvas();
  }, [emojis]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 600;
    canvas.height = 400;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all emojis
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    emojis.forEach(({ emoji, x, y }) => {
      ctx.fillText(emoji, x, y);
    });
    
    // Save to parent
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  const addEmoji = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setEmojis([...emojis, { emoji: selectedEmoji, x, y }]);
  };

  const clearCanvas = () => {
    setEmojis([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm text-gray-300">Select emoji to place:</label>
        <div className="flex flex-wrap gap-2">
          {emojiPalette.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-3xl p-2 rounded-lg border-2 transition ${
                selectedEmoji === emoji
                  ? "border-emerald-500 bg-emerald-900/30 scale-110"
                  : "border-gray-700 hover:border-emerald-700"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-300">
          Selected: <span className="text-3xl">{selectedEmoji}</span>
        </p>
        <button
          type="button"
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onClick={addEmoji}
        className="w-full border-2 border-emerald-700 rounded-lg cursor-pointer bg-white"
        style={{ maxWidth: "600px", aspectRatio: "3/2" }}
      />
      <p className="text-xs text-gray-400">
        👆 Click on the canvas to place emojis!
      </p>
    </div>
  );
}

const CATEGORIES = [
  {
    id: "graffiti",
    name: "🎨 Graffiti",
    description: "Draw or write on a blank canvas",
    placeholder: "",
    maxLength: 0,
    isCanvas: true,
  },
  {
    id: "guestbook",
    name: "� Guestbook",
    description: "Sign the guestbook with a message (max 200 chars)",
    placeholder: "Leave your mark in the book...",
    maxLength: 200,
  },
  {
    id: "song",
    name: "💿 Song Recommendation",
    description: "Share a song you're vibing to",
    placeholder: "Artist - Song Title",
    maxLength: 100,
  },
  {
    id: "emoji",
    name: "😊 Emoji Message",
    description: "Create a message with emojis",
    placeholder: "",
    maxLength: 0,
    isCanvas: true,
  },
  {
    id: "fortune",
    name: "🥠 Fortune Cookie",
    description: "Share wisdom, advice, or a quote (max 150 chars)",
    placeholder: "Your fortune...",
    maxLength: 150,
  },
];

// Simple browser fingerprinting
const generateFingerprint = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillText("fingerprint", 2, 2);
  }

  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + "x" + screen.height,
    screen.colorDepth,
    canvas.toDataURL(),
  ].join("|||");

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export default function ContributePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [songLink, setSongLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    if (!selectedCategory || !name || !content) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const fingerprint = generateFingerprint();

      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category: selectedCategory,
          content,
          website_url: websiteUrl || null,
          song_link: songLink || null,
          fingerprint,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "✨ Submitted! Your contribution will appear after approval.",
        );
        setName("");
        setContent("");
        setWebsiteUrl("");
        setSongLink("");
        setSelectedCategory("");
      } else {
        setError(data.error || "Failed to submit");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1410] text-white">
      <Header compact={true} customHeaderText="nheek" />
      
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            leave your mark ✨
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            choose a category and share something with the world
          </p>
          <Link
            href="/wall"
            className="mt-6 inline-block text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
          >
            → view all contributions
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-emerald-900/40 border border-emerald-500/50 backdrop-blur p-4 text-center text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-900/40 border border-red-500/50 backdrop-blur p-4 text-center text-red-300">
            {error}
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-lg p-6 text-left transition-all duration-300 border-2 backdrop-blur ${
                selectedCategory === category.id
                  ? "bg-emerald-700 border-emerald-500 text-white shadow-xl scale-105"
                  : "bg-[#0d1f1a]/50 border-emerald-900/30 text-white hover:border-emerald-700/50 hover:bg-[#0d1f1a]/70"
              }`}
            >
              <div className="text-4xl mb-2">{category.name.split(" ")[0]}</div>
              <h3 className="font-semibold text-lg">
                {category.name.substring(category.name.indexOf(" ") + 1)}
              </h3>
              <p
                className={`mt-2 text-sm ${
                  selectedCategory === category.id
                    ? "text-emerald-100"
                    : "text-gray-400"
                }`}
              >
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {/* Submission Form */}
        {selectedCategory && (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-[#0d1f1a]/50 backdrop-blur border-2 border-emerald-900/30 p-8 shadow-xl"
          >
            <h2 className="mb-6 text-3xl font-bold text-white">
              {currentCategory?.name}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  your name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border border-emerald-900/50 bg-[#0a1410]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="your name or nickname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  your {currentCategory?.name.split(" ")[1].toLowerCase()}{" "}
                  <span className="text-red-400">*</span>
                </label>
                
                {currentCategory?.isCanvas ? (
                  selectedCategory === "graffiti" ? (
                    <GraffitiCanvas onSave={(data) => setContent(data)} />
                  ) : (
                    <EmojiCanvas onSave={(data) => setContent(data)} />
                  )
                ) : (
                  <>
                    <textarea
                      required
                      maxLength={currentCategory?.maxLength}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={5}
                      className="block w-full rounded-md border border-emerald-900/50 bg-[#0a1410]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                      placeholder={currentCategory?.placeholder}
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      {content.length}/{currentCategory?.maxLength} characters
                    </p>
                  </>
                )}
              </div>

              {selectedCategory === "song" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    song link (optional)
                  </label>
                  <input
                    type="url"
                    value={songLink}
                    onChange={(e) => setSongLink(e.target.value)}
                    className="block w-full rounded-md border border-purple-900/50 bg-[#0a1410]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
                    placeholder="https://spotify.com/... or https://youtube.com/..."
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    share a link to listen to the song you're recommending
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  your website (optional)
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="block w-full rounded-md border border-emerald-900/50 bg-[#0a1410]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  placeholder="https://..."
                />
              </div>

              <div className="rounded-md bg-emerald-900/30 border border-emerald-500/30 backdrop-blur p-4">
                <p className="text-sm text-emerald-300">
                  ℹ️ you can submit <strong>one entry per category</strong>.
                  your submission will be reviewed before appearing publicly.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-full px-6 py-4 text-lg font-semibold transition-all duration-300 ${
                  submitting
                    ? "cursor-not-allowed bg-gray-600 text-gray-400"
                    : "bg-emerald-700 hover:bg-emerald-600 text-white hover:scale-105 shadow-lg hover:shadow-emerald-500/50"
                }`}
              >
                {submitting ? "submitting..." : "submit your contribution"}
              </button>
            </div>
          </form>
        )}

        {!selectedCategory && (
          <div className="rounded-lg bg-[#0d1f1a]/50 backdrop-blur border-2 border-emerald-900/30 p-16 text-center">
            <p className="text-xl text-gray-400">
              select a category above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
