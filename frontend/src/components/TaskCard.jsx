import React, { useState } from "react";
import API from "../api";

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      const res = await API.put(`/tasks/${task._id}`, {
        title,
      });

      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
      }}
    >
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleSave} disabled={loading}>
            {loading ? "..." : "Save"}
          </button>
        </>
      ) : (
        <>
          <span
            style={{ flex: 1, cursor: "pointer" }}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {task.title}
          </span>
          <button
            onClick={handleDelete}
            style={{
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}
