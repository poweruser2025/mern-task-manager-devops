import React, { useState } from "react";
import API from "../api";

export default function CreateTask({ onCreated }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      const res = await API.post("/tasks", {
        title,
        description: title, // required by backend
        list: "todo",
        position: 0,
      });

      setTitle("");
      onCreated(res.data);
    } catch (err) {
      console.error("Create task failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Enter new task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 6, marginRight: 8 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
