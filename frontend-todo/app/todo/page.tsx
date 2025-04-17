"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  date: string;
};

async function getTodos(page = 1): Promise<{ todos: Todo[] }> {
  const res = await fetch(`http://localhost:5000/api/todos?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch todos");

  return res.json();
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const router = useRouter();

  useEffect(() => {
    getTodos().then(({ todos }) => setTodos(todos));
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTodos(todos.filter((todo) => todo._id !== id));
      if (selectedTodo?._id === id) {
        setSelectedTodo(null);
        setShowDetail(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedTodo) return;

    const res = await fetch(
      `http://localhost:5000/api/todos/${selectedTodo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      }
    );

    if (res.ok) {
      const updatedTodo = await res.json();
      const updatedList = todos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      );
      setTodos(updatedList);
      setSelectedTodo(updatedTodo);
      setIsEditing(false);
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowDetail(true);
    setIsEditing(false);
  };

  const handleBack = () => {
    setShowDetail(false);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="md:w-1/3 w-full p-6  overflow-y-auto">
        <div className="w-full p-4 border-black text-left text-2xl font-bold">
          To-Do
        </div>

        {/* Search Add */}
        <div className="flex items-center mb-4 space-x-2">
          <button
            onClick={() => router.push("/todo/create")}
            className="mb-4 bg-blue-600 text-white rounded px-4 py-2 text-sm font-semibold w-fit flex items-center space-x-1"
          >
            <span className="text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{
                  fill: "rgba(19, 14, 14, 1)",
                  transform: "",
                  msFilter: "",
                }}
              >
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8l8-8V5a2 2 0 0 0-2-2zm-7 16v-7h7l-7 7z"></path>
              </svg>
            </span>
            <span>TODO</span>
          </button>
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 w-full">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent w-full outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="text-gray-500 text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{
                  fill: "rgba(13, 10, 10, 1)",
                  transform: "",
                  msFilter: "",
                }}
              >
                <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
              </svg>
            </span>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              className={`p-4 rounded-md cursor-pointer shadow-sm bg-gray-50 border ${
                selectedTodo?._id === todo._id
                  ? "border-black"
                  : "border-gray-200"
              }`}
              onClick={() => handleSelectTodo(todo)}
            >
              <div className="font-semibold">{todo.title}</div>
              <div className="text-sm text-gray-500 truncate">
                {todo.description}
              </div>
              <div className="text-xs text-right text-gray-400">
                {new Date(todo.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      {showDetail && selectedTodo && (
        <div className="md:w-2/3 w-full p-6 overflow-y-auto">
          {/* Back Button for Mobile */}
          <div className="md:hidden mb-4">
            <button
              onClick={handleBack}
              className="text-blue-600 text-sm font-semibold"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white rounded-md shadow-md p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              {isEditing ? (
                <input
                  type="text"
                  className="text-2xl font-bold outline-none border-b border-gray-300 w-full mr-4"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <h1 className="text-2xl font-bold">{selectedTodo.title}</h1>
              )}

              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedTitle(selectedTodo.title);
                      setEditedDescription(selectedTodo.description || "");
                    }}
                    className="text-blue-600 text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      style={{
                        fill: "rgba(19, 14, 14, 1)",
                        transform: "",
                        msFilter: "",
                      }}
                    >
                      <path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path>
                      <path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path>
                    </svg>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="text-green-600 text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(selectedTodo._id)}
                  className="text-red-500 text-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{
                      fill: "rgba(13, 10, 10, 1)",
                      transform: "",
                      msFilter: "",
                    }}
                  >
                    <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                    <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Format Symbols */}
            <div className="flex space-x-4 text-sm mb-4 text-gray-500">
              <button className="font-bold">B</button>
              <button className="italic">I</button>
              <button className="underline">U</button>
              <button className="border px-1">≡</button>
            </div>

            {/* Description */}
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-gray-700 flex-grow w-full border rounded-md p-2 outline-none resize-none"
                rows={8}
              />
            ) : (
              <p className="text-gray-700 flex-grow">
                {selectedTodo.description}
              </p>
            )}

            {/* Date */}
            <div className="text-xs text-right text-gray-400 mt-6">
              {new Date(selectedTodo.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
