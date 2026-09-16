import { useEffect, useState } from "react";
import { type ProjectData } from "./types";
import LoadingScreen from "../Loading";
import NotFound from "../NotFound";
import ProjectTable from "./table";

// ==========================================
// 1. TYPES & CONFIGURATION
// ==========================================

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    // Note the leading slash: /teams.json points to the public folder root
    fetch("/Projects.json")
      .then((res) => {
        if (!res.ok) setIsError(true);
        return res.json();
      })
      .then((data: ProjectData[]) => {
        setIsLoading(false);
        setProjects(data);
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);
  console.log(projects);
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : !isError ? (
        <div className="w-screen min-h-screen bg-gray-400 px-6! md:px-12! py-12! md:py-18!">
          <h1 className="Projects mb-12! text-xl! md:text-3xl!">
            All Projects
          </h1>
          <ProjectTable data={projects} />
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
}
