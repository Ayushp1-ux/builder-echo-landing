import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Question {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
  response: string | null;
  category: string;
  contact_method: string;
  file_url: string | null; // Added to track uploaded file path
}

export default function LawyerDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const statuses = ["all", "pending", "answered"];
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch questions with status filter
  useEffect(() => {
    async function fetchQuestions() {
      let query = supabase.from("questions").select("*").order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (!error && data) {
        setQuestions(data);
      }
    }

    fetchQuestions();
  }, [filterStatus]);

  const handleSelect = (question: Question) => {
    setSelectedQuestion(question);
    setResponseText(question.response || "");
  };

  const handleSaveResponse = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    const { error } = await supabase
      .from("questions")
      .update({ response: responseText, status: "answered" })
      .eq("id", selectedQuestion.id);
    if (!error) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestion.id ? { ...q, response: responseText, status: "answered" } : q
        )
      );
      setSelectedQuestion(null);
      setResponseText("");
    }
    setLoading(false);
  };

  async function markAsAnswered(questionId: string) {
    const { error } = await supabase
      .from("questions")
      .update({ status: "answered" })
      .eq("id", questionId);

    if (!error) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, status: "answered" } : q
        )
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lawyer Dashboard</h1>

      <div className="mb-4">
        {statuses.map((status) => (
          <button
            key={status}
            className={`mr-3 px-4 py-2 rounded ${
              filterStatus === status ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Questions list */}
        <div className="w-1/3 border-r pr-4 max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">User Questions</h2>
          {questions.length === 0 && <div>No questions found.</div>}
          <ul>
            {questions.map((q) => (
              <li
                key={q.id}
                onClick={() => handleSelect(q)}
                className="cursor-pointer p-2 mb-2 border rounded hover:bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{q.title}</div>
                  <div className="text-sm text-gray-600">{new Date(q.created_at).toLocaleString()}</div>
                  <div className="text-sm">Status: {q.status}</div>
                  {/* Show document link if available */}
                  {q.file_url && (
                    <a
                      href={supabase.storage.from("question-documents").getPublicUrl(q.file_url).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                    </a>
                  )}
                </div>
                {q.status !== "answered" && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await markAsAnswered(q.id);
                    }}
                    className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Mark as Answered
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Response view */}
        <div className="w-2/3 p-4">
          {selectedQuestion ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">{selectedQuestion.title}</h2>
              <p className="mb-4">{selectedQuestion.description}</p>
              {/* Show document link if available here too */}
              {selectedQuestion.file_url && (
                <p className="mb-4">
                  <a
                    href={supabase.storage.from("question-documents").getPublicUrl(selectedQuestion.file_url).data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Uploaded Document
                  </a>
                </p>
              )}
              <textarea
                className="w-full border p-3 rounded mb-4 min-h-[150px]"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
              />
              <button
                disabled={loading}
                onClick={handleSaveResponse}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {loading ? "Saving..." : "Save Response"}
              </button>
            </>
          ) : (
            <div className="text-gray-500">Select a question to respond</div>
          )}
        </div>
      </div>
    </div>
  );
}
