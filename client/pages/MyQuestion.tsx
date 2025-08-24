import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Question {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  contact_method: string;
  response: string | null;
  created_at: string;
}

export default function MyQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setQuestions(data);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (questions.length === 0) return <div className="p-10 text-center">No questions submitted yet.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Legal Questions</h2>
      {questions.map(q => (
        <div key={q.id} className="mb-5 pb-4 border-b">
          <div className="font-semibold">{q.title}</div>
          <div className="text-sm text-gray-600">{q.category} | {new Date(q.created_at).toLocaleString()}</div>
          <div className="mt-1">{q.description}</div>
          <div className="mt-1"><span className="font-semibold">Status:</span> {q.status}</div>
          {q.response && (
            <div className="mt-2 bg-indigo-50 p-2 rounded">
              <span className="font-semibold">Lawyer's Response:</span>
              <div>{q.response}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
