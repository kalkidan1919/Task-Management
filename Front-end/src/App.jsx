import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("High");
  const [status, setStatus] = useState("Pending");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const validateForm = () => {
    const newErrors = {};
    if (
      !title ||
      title.length < 2 ||
      title.length > 50 ||
      !/^[A-Za-z\s]+$/.test(title)
    ) {
      newErrors.title = "Title must be 2-50 letters only.";
    }
    if (!dueDate || new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date must be today or later.";
    }
    if (description && description.length > 200) {
      newErrors.description = "Description must be under 200 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = () => {
    if (!validateForm()) return;
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      dueDate,
      priority,
      status,
    };
    setTasks(
      [...tasks, newTask].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      )
    );
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("High");
    setStatus("Pending");
    setErrors({});
    titleRef.current.focus();
  };

  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(
      newTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    );
  };

  const toggleStatus = (index) => {
    const updated = tasks.map((task, i) =>
      i === index
        ? {
            ...task,
            status: task.status === "Pending" ? "Completed" : "Pending",
          }
        : task
    );
    setTasks(updated.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("High");
    setStatus("Pending");
    setErrors({});
    titleRef.current.focus();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  return (
    <div className="app">
      <h1>Task Management System</h1>
      <div className="task-form">
        <h2>Add New Task</h2>
        <div className="form-group">
          <label htmlFor="title">Title (Required)</label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Finish Report"
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Weekly summary"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date (Required)</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {errors.dueDate && <p className="error">{errors.dueDate}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="button-container">
          <button onClick={handleAddTask}>Add Task</button>
          <button onClick={clearForm} className="clear-btn">
            Clear
          </button>
        </div>
      </div>
      <div className="task-filter">
        <label>Filter Tasks: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All ({tasks.length})</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="task-list">
        <h2>{filter} Tasks</h2>
        {filteredTasks.length === 0 ? (
          <p>No {filter.toLowerCase()} tasks.</p>
        ) : (
          filteredTasks.map((task, index) => (
            <div
              key={index}
              className={`task ${
                task.status === "Completed" ? "completed" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={task.status === "Completed"}
                onChange={() => toggleStatus(index)}
              />
              <div className="task-info">
                <strong>ID: {task.id}</strong>
                <strong>{task.title}</strong>
                {task.description && <p>{task.description}</p>}
                <small>Due: {task.dueDate}</small>
                <small>Priority: {task.priority}</small>
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
              <button onClick={() => handleDelete(index)}>🗑</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
