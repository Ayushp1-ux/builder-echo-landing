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
  file_url: string | null;
}

export default function LawyerDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const statuses = ["all", "pending", "answered"];
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
    <div className="min-h-screen bg-gray-900 dark:bg-gray-950 flex flex-col py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white dark:text-indigo-200">Lawyer Dashboard</h1>
      <div className="flex flex-1 w-full max-w-6xl mx-auto gap-8">
        {/* Questions list */}
        <div className="w-full max-w-xs bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex gap-2 mb-6">
            {statuses.map((status) => (
              <button
                key={status}
                className={`px-4 py-1 rounded font-bold
                  ${filterStatus === status
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-300"}
                  transition`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <h3 className="font-bold text-lg text-indigo-300 mb-3">User Questions</h3>
          {questions.length === 0 && <div className="text-gray-400">No questions found.</div>}
          <ul>
            {questions.map((q) => (
              <li
                key={q.id}
                onClick={() => handleSelect(q)}
                className={`mb-4 p-4 rounded-lg cursor-pointer border transition
                  ${selectedQuestion && selectedQuestion.id === q.id
                    ? "border-indigo-400 bg-gray-900"
                    : "border-gray-700 bg-gray-800 hover:border-indigo-400 hover:bg-gray-900"}`}
              >
                <div className="font-semibold text-white">{q.title}</div>
                <div className="text-xs text-gray-400 mb-1">{new Date(q.created_at).toLocaleString()}</div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full font-bold
                  ${q.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                  {q.status}
                </span>
                {q.file_url && (
                  <div className="mt-1">
                    <a
                      href={supabase.storage.from("question-documents").getPublicUrl(q.file_url).data.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 underline text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                    </a>
                  </div>
                )}
                {q.status !== "answered" && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await markAsAnswered(q.id);
                    }}
                    className="ml-2 mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  >
                    Mark as Answered
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Response view */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col">
          {selectedQuestion ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">{selectedQuestion.title}</h2>
              <div className="text-gray-700 dark:text-gray-300 mb-4">{selectedQuestion.description}</div>
              {selectedQuestion.file_url && (
                <p className="mb-4">
                  <a
                    href={supabase.storage.from("question-documents").getPublicUrl(selectedQuestion.file_url).data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline text-sm"
                  >
                    View Uploaded Document
                  </a>
                </p>
              )}
              <textarea
                className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none mb-4"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
              />
              <button
                disabled={loading}
                onClick={handleSaveResponse}
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Response"}
              </button>
            </>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 flex items-center h-full">Select a question to respond</div>
          )}
        </div>
      </div>
    </div>
  );
}
