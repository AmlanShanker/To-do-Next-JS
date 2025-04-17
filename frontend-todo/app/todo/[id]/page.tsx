"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TodoDetails({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<{
    title: string;
    description: string;
    date: string;
    _id: string;
  } | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/todos/${params.id}`)
      .then((res) => setTodo(res.data));
  }, [params.id]);

  const handleChange = (field: string, value: any) => {
    if (todo) {
      const updated = { ...todo, [field]: value };
      setTodo(updated);
      axios.put(`http://localhost:5000/api/todos/${todo._id}`, updated);
    }
  };

  if (!todo) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white p-6 border-r overflow-y-auto">
        {/* Sidebar could be reused here */}
      </div>

      <div className="flex-1 p-6 bg-white">
        <input
          className="text-2xl font-bold mb-4 w-full"
          value={todo.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded h-40"
          value={todo.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <p className="text-sm text-gray-400 mt-2">
          Last updated: {new Date(todo.date).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
