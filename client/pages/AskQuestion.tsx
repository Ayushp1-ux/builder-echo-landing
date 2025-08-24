import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CATEGORIES = [
  "Divorce",
  "Property",
  "Criminal",
  "Business",
  "Employment",
  "Other",
];

const CONTACT_METHODS = [
  "Email",
  "Phone",
  "Either",
];

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [contactMethod, setContactMethod] = useState<string>(CONTACT_METHODS[0]);
  const [file, setFile] = useState<File | null>(null); // New state for file upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("Please log in to submit a question.");
      setLoading(false);
      return;
    }

    let fileUrl: string | null = null;
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("question-documents")
        .upload(fileName, file);

      if (uploadError) {
        setError("File upload failed. Please try again.");
        setLoading(false);
        return;
      }

      fileUrl = data?.path ?? null;
    }

    const { error: insertError } = await supabase.from("questions").insert({
      user_id: user.id,
      title,
      description,
      category,
      contact_method: contactMethod,
      file_url: fileUrl, // Save file URL in question record
    });

    if (insertError) {
      setError("Failed to submit question. Please try again.");
    } else {
      setSuccess(true);
      setTitle("");
      setDescription("");
      setFile(null); // Reset file input on success
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-indigo-200">
        <div className="p-8 bg-white rounded shadow text-center">
          <h2 className="mb-4 text-green-600 font-bold text-xl">Your question has been submitted!</h2>
          <p className="mb-2">A legal expert will respond soon.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit another question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md border border-indigo-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Ask a Legal Question</h2>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="mb-4">
          <label htmlFor="title" className="block font-semibold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Describe your issue in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block font-semibold mb-2">
            Upload Document (optional)
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block font-semibold mb-2">
            Category
          </label>
          <select
            id="category"
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="contactMethod" className="block font-semibold mb-2">
            Preferred Contact Method
          </label>
          <select
            id="contactMethod"
            className="w-full border px-3 py-2 rounded"
            value={contactMethod}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContactMethod(e.target.value)}
          >
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Submitting..." : "Submit Question"}
        </button>
      </form>
    </div>
  );
}
