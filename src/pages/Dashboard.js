import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'submittal-tracker-projects';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects([
        {
          id: Date.now(),
          name: '',
          tasks: [],
          archived: false,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleNewProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      tasks: [],
      archived: false,
    };
    setProjects([newProject, ...projects]);
  };

  const updateProject = (id, field, value) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    );
  };

  const deleteProject = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const archiveProject = (id) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, archived: true } : proj))
    );
  };

  const restoreProject = (id) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, archived: false } : proj))
    );
  };

  const addTask = (projectId) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? { ...proj, tasks: [...(proj.tasks || []), { text: '', done: false, pdfs: [] }] }
          : proj
      )
    );
  };

  const updateTask = (projectId, index, field, value) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updatedTasks = [...(proj.tasks || [])];
          updatedTasks[index] = { ...updatedTasks[index], [field]: value };
          return { ...proj, tasks: updatedTasks };
        }
        return proj;
      })
    );
  };

  const deleteTask = (projectId, index) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updatedTasks = [...(proj.tasks || [])];
          updatedTasks.splice(index, 1);
          return { ...proj, tasks: updatedTasks };
        }
        return proj;
      })
    );
  };

  const handleFileUpload = (projectId, index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id === projectId) {
            const tasks = [...proj.tasks];
            const pdfs = [...(tasks[index].pdfs || []), { name: file.name, content: reader.result }];
            tasks[index] = { ...tasks[index], pdfs };
            return { ...proj, tasks };
          }
          return proj;
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const removePdf = (projectId, taskIdx, pdfIdx) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const tasks = [...proj.tasks];
          const pdfs = [...(tasks[taskIdx].pdfs || [])];
          pdfs.splice(pdfIdx, 1);
          tasks[taskIdx] = { ...tasks[taskIdx], pdfs };
          return { ...proj, tasks };
        }
        return proj;
      })
    );
  };

  const autoResize = (el) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  const activeProjects = projects.filter((p) => !p.archived);
  const archivedProjects = projects.filter((p) => p.archived);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex justify-between items-center px-10 py-6 bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-3xl font-bold">Submittal Tracker</h1>
        <button
          onClick={handleNewProject}
          className="bg-blue-700 text-white px-6 py-2 text-sm rounded hover:bg-blue-800"
        >
          + New Project
        </button>
      </div>

      {activeProjects.map((project) => (
        <div
          key={project.id}
          className="max-w-5xl mx-auto my-8 bg-white rounded-3xl shadow-xl p-10 transition"
        >
          <input
            type="text"
            value={project.name}
            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
            placeholder="Project Name"
            className="text-3xl font-semibold w-full mb-6 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
          />

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div
              className="flex-1 bg-white rounded-xl shadow-md border border-gray-300 p-6 hover:shadow-lg cursor-pointer transition"
              onClick={() => navigate(`/submittal/${project.id}`)}
            >
              <h2 className="text-lg font-semibold mb-2">Submittal Tracker</h2>
              <p className="text-xs text-gray-600">Click to manage submittals for this project.</p>
            </div>

            <div
              className="flex-1 bg-white rounded-xl shadow-md border border-gray-300 p-6 hover:shadow-lg cursor-pointer transition"
              onClick={() => navigate(`/flowchart/${project.id}`)}
            >
              <h2 className="text-lg font-semibold mb-2">Flowchart</h2>
              <p className="text-xs text-gray-600">Click to open the visual flowchart.</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <button
              onClick={() => addTask(project.id)}
              className="mb-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Task
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(project.tasks || []).map((task, idx) => (
                <div key={idx} className="flex flex-col border rounded p-2 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(e) =>
                        updateTask(project.id, idx, 'done', e.target.checked)
                      }
                    />
                    <textarea
                      value={task.text}
                      onChange={(e) => {
                        updateTask(project.id, idx, 'text', e.target.value);
                        autoResize(e.target);
                      }}
                      placeholder="Task..."
                      className={`flex-1 text-sm resize-none border-none bg-transparent focus:outline-none overflow-hidden ${
                        task.done ? 'line-through text-gray-400' : ''
                      }`}
                      rows={1}
                      ref={(el) => el && autoResize(el)}
                    />
                  </div>

                  {/* PDF section */}
                  <div className="mt-2 space-y-1">
                    {(task.pdfs || []).map((pdf, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <a
                          href={pdf.content}
                          download={pdf.name}
                          className="text-blue-600 underline truncate"
                        >
                          {pdf.name}
                        </a>
                        <button
                          onClick={() => removePdf(project.id, idx, i)}
                          className="text-red-500 text-[10px] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(project.id, idx, e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                      className="text-xs"
                    />
                  </div>

                  <button
                    onClick={() => deleteTask(project.id, idx)}
                    className="text-xs text-red-500 hover:underline mt-2 self-end"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => archiveProject(project.id)}
              className="text-sm text-yellow-700 border border-yellow-500 px-3 py-1 rounded hover:bg-yellow-100"
            >
              Archive
            </button>
            <button
              onClick={() => deleteProject(project.id)}
              className="text-sm text-red-700 border border-red-500 px-3 py-1 rounded hover:bg-red-100"
            >
              Delete Project
            </button>
          </div>
        </div>
      ))}

      {archivedProjects.length > 0 && (
        <div className="max-w-5xl mx-auto my-12 p-6 bg-yellow-50 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Archived Projects</h2>
          {archivedProjects.map((project) => (
            <div key={project.id} className="mb-4 p-4 border rounded bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{project.name}</span>
                <button
                  onClick={() => restoreProject(project.id)}
                  className="text-sm text-green-600 border border-green-500 px-3 py-1 rounded hover:bg-green-100"
                >
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
