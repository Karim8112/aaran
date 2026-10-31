import { z } from "zod";

export interface ProjectType {
  _id: string;
  name: string;
}

export interface IProject {
  _id?: string;
  name: string;
  mainImage: string;
  quickOverview: string;
  summary?: string;
  organization?: string;
  imagesBefore?: string[];
  imagesAfter?: string[];
  projectType: ProjectType;
}

export interface IProjectRequest {
  _id?: string;
  name: string;
  mainImage: File | string;
  quickOverview: string;
  summary?: string;
  organization?: string;
  imagesBefore?: (string | File)[];
  imagesAfter?: (string | File)[];
  projectType: string;
}

export const ProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Title must be 30 characters or less"),
  //     quickOverview
  // summary
  quickOverview: z
    .string()
    .min(1, "Quick overview is required")
    .max(200, "Quick Overview should be less than 200 letter"),

  summary: z.string().optional().or(z.literal("")),
  organization: z
    .string()
    .max(30, "Organization name must be 30 characters or less")
    .optional()
    .or(z.literal("")),

  projectType: z.string().min(1, "Project Type is required"),
  imagesBefore: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  imagesAfter: z.array(z.union([z.instanceof(File), z.string()])).optional(),
  mainImage: z.union([z.instanceof(File), z.string()]),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;
