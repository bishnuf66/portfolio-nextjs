import React from "react";
import Image from "next/image";
import { Star, Edit2, Trash2 } from "lucide-react";
import { Project } from "@/lib/supabase";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

interface ProjectListProps {
  projects: Project[];
  isDarkMode: boolean;
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isDarkMode,
  handleEdit,
  handleDelete,
}) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
  } = usePagination({
    data: projects,
    itemsPerPage: 5,
  });

  return (
    <div>
      <div className="grid gap-6">
        {paginatedData.map((project) => (
          <div
            key={project.id}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg ${project.is_featured ? "ring-2 ring-yellow-500" : ""
              }`}
          >
            <div className="flex gap-6">
              <div className="relative">
                <Image
                  src={
                    project.cover_image_url ?? "/project-images/placeholder.png"
                  }
                  alt={project.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                {project.is_featured && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      {project.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div
                      className="text-sm text-gray-600 dark:text-gray-400 mb-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: project.description,
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Project
                      </a>
                      <span className="text-gray-500">{project.category}</span>
                      <span className="text-gray-400">
                        Slug: {project.slug || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>
            📁
          </div>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            No projects found. Create your first project!
          </p>
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={5}
          totalItems={projects.length}
        />
      )}
    </div>
  );
};

export default ProjectList;
