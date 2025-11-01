import { useState } from "react";
import toast from "react-hot-toast";
import { client } from "../src/sanity/lib/client";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Submitting post...");

      await client.create({
        _type: "post",
        title,
        content: [{ _type: "block", children: [{ _type: "span", text: description }] }],
      });

      toast.dismiss();
      toast.success("Post created successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.dismiss();
      toast.error("Error creating post!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg shadow bg-white space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Create New Blog</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          className="w-full border rounded-md p-2 h-32 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
