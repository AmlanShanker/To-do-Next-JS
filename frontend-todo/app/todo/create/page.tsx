"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo = {
      title,
      description,
      date,
    };

    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to create todo");
    }
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Create a New Todo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border border-black rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border border-black rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border border-black rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
