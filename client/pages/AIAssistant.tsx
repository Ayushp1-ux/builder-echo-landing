import { useState } from "react";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        "https://wutkiwsapywuxdirpngh.supabase.co/functions/v1/openrouter-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // No Authorization header here
          },
          body: JSON.stringify({
            messages: [
              { role: "user", content: question }
            ]
          }),
        }
      );

      const data = await res.json();

      if (data.answer) {
        setResponse(data.answer);
      } else {
        setResponse(data.error || "No answer returned.");
      }
    } catch (err) {
      setResponse("Error getting AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Legal Assistant</h1>

      <textarea
        className="w-full border p-3 rounded mb-4 min-h-[150px]"
        placeholder="Type your legal question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={loading}
      />

      <button
        onClick={handleAskAI}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Asking AI..." : "Ask AI"}
      </button>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-line">
          <strong>AI Response:</strong>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
}
