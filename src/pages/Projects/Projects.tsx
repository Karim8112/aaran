// import { useFormContext } from '@/context/form/formContext'
import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router'
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Folder, Image as ImageIcon } from "lucide-react";
import { useProject } from "./useProject";

import { PaginationComponent } from "../../components/paginationcomponent";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { type IFilter } from "../../Model/IApi";
import { type IProject } from "../../Model/IProject";
import { useNavigate } from "react-router";
import { useProjectTypes } from "./useProjectType";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const ProjectCard = function (props: { project: IProject; index: string }) {
  const navigate = useNavigate();
  const { project } = props;
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group! h-[350px]!"
    >
      <Card className="flex! h-full! flex-col! overflow-hidden! transition-all! duration-300! group-hover:shadow-lg! dark:group-hover:shadow-primary/5!">
        {/* 1. REQUIRED FIELD: mainImage */}
        <div className="relative! aspect-video! w-full! overflow-hidden! bg-muted!">
          <img
            src={project.mainImage}
            alt={project.name}
            className="h-full! w-full! object-cover! transition-transform! duration-500! group-hover:scale-105!"
            loading="lazy"
          />

          {/* 2. REQUIRED FIELD: projectType (Badge Overlay) */}
          <div className="absolute! left-3! top-3!">
            <Badge
              variant="secondary"
              className="flex! items-center! gap-1! bg-background/80! text-xs! font-medium! shadow-sm! backdrop-blur-md!"
            >
              <Folder className="h-3! w-3!" />
              {project.projectType?.name}
            </Badge>
          </div>
        </div>

        {/* Card Header */}
        <CardHeader className="p-4! pb-2!">
          {/* 3. REQUIRED FIELD: name */}
          <CardTitle className="line-clamp-1! text-lg! font-bold! transition-colors! group-hover:text-primary!">
            {project.name}
          </CardTitle>
        </CardHeader>

        {/* Card Body */}
        <CardContent className="flex-1! p-4! pt-0!">
          {/* 4. REQUIRED FIELD: quickOverview */}
          <p className="line-clamp-3! text-sm! leading-relaxed! text-muted-foreground!">
            {project.quickOverview}
          </p>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="p-4! pt-0!">
          <Button
            variant="outline"
            size="sm"
            className="group/btn! w-full! justify-between! transition-colors! hover:bg-primary! hover:text-primary-foreground!"
            onClick={() => {
              navigate(`/projects/${project._id}`);
            }}
          >
            <span>View Details</span>
            <ArrowUpRight className="h-4! w-4! transition-transform! group-hover/btn:-translate-y-0.5! group-hover/btn:translate-x-0.5!" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function Project() {
  //   const { setProject } = useFormContext()
  //   const navigate = useNavigate()
  const Project = useProject();
  const projectType = useProjectTypes();

  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<IFilter | undefined>(undefined);
  // getting the data first time
  useEffect(() => {
    Project.getData({ page, filter: filter });
  }, [page, filter]);

  if ((!Project.data || Project.data.data.length === 0) && !Project.loading) {
    return (
      <div className="flex! min-h-[300px]! flex-col! items-center! justify-center! rounded-xl! border! border-dashed! p-8! text-center!">
        <ImageIcon className="mb-3! h-10! w-10! text-muted-foreground!" />
        <h3 className="text-lg! font-semibold!">No Projects Found</h3>
        <p className="text-sm! text-muted-foreground!">
          There are currently no projects available to display.
        </p>
      </div>
    );
  }

  return (
    <div className="flex! flex-col! gap-4! py-16!">
      {/* pagination header */}
      <div className="flex! w-full! items-center! justify-between! px-8!">
        <div className="mb-4! ms-2! flex! flex-col! items-start! justify-start! gap-4!">
          <h1 className="text-3xl! font-semibold! tracking-wide! text-[#D1B797]">
            All Projects
          </h1>
          <Select
            onValueChange={(e) => {
              setPage(1);
              setFilter({ name: "projectType", operator: "equal", value: e });
            }}
            defaultValue={filter?.value}
            value={filter?.value}
          >
            <SelectTrigger className="w-64! cursor-pointer!">
              <SelectValue placeholder="select project type"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className="cursor-pointer!" key={"All"} value={""}>
                  {`All`}
                </SelectItem>
                {projectType.loading
                  ? "...Loading"
                  : projectType.data?.data.map((projectType) => (
                      <SelectItem
                        className="cursor-pointer!"
                        key={projectType._id}
                        value={projectType._id}
                      >
                        {projectType.name}
                      </SelectItem>
                    ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>
            total:{" "}
            <span className="font-bold!">
              {!Project.loading ? Project?.data?.total : ""}
            </span>
          </span>
        </div>

        <PaginationComponent
          loading={Project.loading}
          page={page}
          setPage={setPage}
          total={Project?.data?.total as number}
        />
      </div>

      {/* grid */}
      {Project.loading ? (
        <div className="grid! grid-cols-1! gap-6! p-4! sm:grid-cols-2! lg:grid-cols-3! xl:grid-cols-4!">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80! w-full! animate-pulse! rounded-xl! bg-slate-200! dark:bg-slate-800!"
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid! grid-cols-1! gap-6! sm:grid-cols-2! lg:grid-cols-3! xl:grid-cols-4! p-8!"
        >
          {Project?.data?.data &&
            Project.data.data.map((project, index) => {
              // Fallback key if _id is undefined
              return (
                <ProjectCard
                  key={project._id || `project-${index}`}
                  project={project}
                  index={String(index)}
                />
              );
            })}
        </motion.div>
      )}
    </div>
  );
}
