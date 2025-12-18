import React, { useEffect, useState } from "react";
import API from "../api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "../components/TaskCard";
import CreateTask from "../components/CreateTask";

const listsOrder = ["todo", "inprogress", "done"];

const listNames = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export default function Board() {
  const [tasks, setTasks] = useState([]);

  const handleTaskCreated = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleTaskDelete = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  // fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // group tasks by list
  const groupByList = (tasksArr) => {
    return listsOrder.reduce((acc, list) => {
      acc[list] = tasksArr
        .filter((t) => t.list === list)
        .sort((a, b) => a.position - b.position);
      return acc;
    }, {});
  };

  // drag handler
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const grouped = groupByList(tasks);

    const sourceList = Array.from(grouped[source.droppableId] || []);
    const destList = Array.from(grouped[destination.droppableId] || []);

    const [moved] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, moved);
    // 🔹 save status change in backend
    await fetch(`http://localhost:4000/api/tasks/${moved._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        list: destination.droppableId,
        position: destination.index,
      }),
    });
    moved.list = destination.droppableId;

    const updatedTasks = tasks.map((task) => {
      if (task._id === moved._id) {
        return {
          ...task,
          list: destination.droppableId,
          position: destination.index,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    

    // persist moved task
    try {
      await API.put(`/tasks/${moved._id}`, {
        list: destination.droppableId,
        position: destination.index,
      });
    } catch (err) {
      console.error("Failed to update task", err);
      fetchTasks();
    }
  };

  const grouped = groupByList(tasks);

  return (
    <div style={{ padding: 12 }}>
      {/* ✅ CREATE TASK UI */}
      <CreateTask onCreated={handleTaskCreated} />

      {/* ✅ BOARD */}
      <div style={{ display: "flex", gap: 12 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {listsOrder.map((listKey) => (
            <Droppable droppableId={listKey} key={listKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: 280,
                    padding: 8,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                  }}
                >
                  <h3>{listNames[listKey]}</h3>

                  {(grouped[listKey] || []).map((task, index) => (
                    <Draggable
                      draggableId={String(task._id)}
                      index={index}
                      key={task._id}
                    >
                      {(prov) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          style={{
                            marginBottom: 8,
                            ...prov.draggableProps.style,
                          }}
                        >
                          <TaskCard
                            task={task}
                            onDelete={handleTaskDelete}
                            onUpdate={handleTaskUpdate}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
