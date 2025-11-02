import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectManagerProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const COLORS = ['#34d399', '#f97316', '#ec4899', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#6366f1'];

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, setProjects }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() === '') return;
    
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      color: selectedColor,
    };

    setProjects(prev => [...prev, newProject]);
    setNewProjectName('');
    setSelectedColor(COLORS[(COLORS.indexOf(selectedColor) + 1) % COLORS.length]);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Projects</h2>
      <form onSubmit={handleAddProject} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name..."
          className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-mint-500 focus:border-mint-500"
        />
        <button type="submit" className="bg-mint-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-mint-700 transition-colors">
          +
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {projects.length > 0 ? projects.map(project => (
          <span key={project.id} className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: `${project.color}20`, color: project.color, border: `1px solid ${project.color}80` }}>
            {project.name}
          </span>
        )) : (
            <p className="text-sm text-gray-500">No projects yet. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;