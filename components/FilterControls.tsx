import React, { useMemo } from 'react';
import { LogEntry, Project } from '../types';

interface FilterControlsProps {
  logs: LogEntry[];
  projects: Project[];
  activeFilter: { type: 'tag' | 'project' | null; value: string | null };
  onSetFilter: (filter: { type: 'tag' | 'project'; value: string }) => void;
  onClearFilter: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ logs, projects, activeFilter, onSetFilter, onClearFilter }) => {
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    logs.forEach(log => {
      log.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [logs]);

  const projectsMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

  if (projects.length === 0 && allTags.length === 0) {
    return null;
  }

  const getButtonClass = (isActive: boolean) => 
    `px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
      isActive
        ? 'bg-mint-500 text-white'
        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    }`;
  
  const getProjectStyle = (project: Project, isActive: boolean) => {
    if (isActive) return { backgroundColor: project.color, color: '#fff', border: `1px solid ${project.color}` };
    return { backgroundColor: `${project.color}20`, color: project.color, border: `1px solid ${project.color}80` };
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mt-8 shadow-lg">
      <div className="flex flex-wrap gap-x-4 gap-y-3 items-center">
        <span className="text-sm font-semibold text-gray-400">Filter by:</span>
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => onSetFilter({ type: 'project', value: project.id })}
            className="px-3 py-1 text-sm font-medium rounded-full transition-opacity"
            style={getProjectStyle(project, activeFilter.type === 'project' && activeFilter.value === project.id)}
          >
            {project.name}
          </button>
        ))}
        {projects.length > 0 && allTags.length > 0 && <div className="h-5 w-px bg-gray-700"></div>}
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => onSetFilter({ type: 'tag', value: tag })}
            className={getButtonClass(activeFilter.type === 'tag' && activeFilter.value === tag)}
          >
            {tag}
          </button>
        ))}
         {activeFilter.type && (
            <button
                onClick={onClearFilter}
                className="text-sm text-mint-400 hover:text-mint-300 ml-auto pl-4"
            >
                Clear Filter
            </button>
        )}
      </div>
    </div>
  );
};

export default FilterControls;