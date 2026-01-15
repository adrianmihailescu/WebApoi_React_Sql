import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  reorderTasks,
} from "../services/taskApi";
import { useAuth } from "../context/AuthContext";

import type Task from "../interfaces/Task";
import TaskForm from "../components/TaskForm";
import TaskRow from "../components/TaskRow";
import "./TaskPage.css";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DraggableProvided,
  type DropResult,
} from "@hello-pangea/dnd";

export default function TasksPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of tasks per page

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (title: string, description?: string) => {
    await createTask({
      title,
      description,
      isCompleted: false,
    });
    loadTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.isCompleted) ||
      (statusFilter === "pending" && !task.isCompleted);

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const pagedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page: number) => {
    if (page < 1)
        page = 1;

    if (page > totalPages)
        page = totalPages;
    setCurrentPage(page);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination)
        return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setTasks(items);

    // Persist order
    await reorderTasks(items.map((t) => t.id));
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            Logged in as: <strong>{user?.email}</strong>
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <TaskForm onAdd={addTask} />

      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "pending" | "completed")
          }
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 && <p>No matching tasks.</p>}

      {filteredTasks.length > 0 && (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <table
                  className="task-table"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagedTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided: DraggableProvided, snapshot) => (
                          <TaskRow
                            task={task}
                            index={index}
                            provided={provided}
                            isDragging={snapshot.isDragging}
                            onTaskUpdate={loadTasks}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>

          {/* Pager */}
          <div className="pager">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={page === currentPage ? "active" : ""}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
