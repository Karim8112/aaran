import LoadingScreen from "../Loading";

import ProjectTable from "./Table";
import { useProject } from "./useProject";

// ==========================================
// 1. TYPES & CONFIGURATION
// ==========================================

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function Projects() {
  const Projects = useProject();

  return (
    <>
      {Projects.loading ? (
        <LoadingScreen what="Projects" />
      ) : (
        <div className="w-screen min-h-screen bg-[#121212] px-6! md:px-12! py-12! md:py-18!">
          <h1 className="Projects mb-12! text-xl! md:text-3xl!">
            All Projects
          </h1>
          <ProjectTable
            data={Projects.data?.data.map((project) => ({
              ...project,
            }))}
          />
        </div>
      )}
    </>
  );
}
