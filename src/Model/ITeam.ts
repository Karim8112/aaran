import { z } from "zod";

type IExprience = {
  role: string;
  period: string;
  company: string;
  description?: string;
};

export default interface ITeam {
  _id?: string;
  title?: string;
  address?: string;
  email?: string;
  phoneNumberS?: string[];
  summary?: string;
  imageLeft?: string;
  imageRight?: string;
  tags?: string[];
  skills?: string[];
  education?: string[];
  languages?: string[];
  experience?: IExprience[];
}

export const ExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  period: z.string().min(1, "Period is required"),
  company: z.string().min(1, "Company is required"),
  description: z.string().optional().or(z.literal("")),
});

export const TeamFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(20, "Title must be 20 characters or less"),
  address: z
    .string()
    .max(100, "Address must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  summary: z.string().min(1, "Summary is required"),
  imageLeft: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  imageRight: z.union([z.instanceof(File), z.string(), z.null()]).optional(),

  // Dynamic list fields (defaulting to empty arrays)
  phoneNumberS: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  experience: z.array(ExperienceSchema).default([]),
});

export type TeamFormValues = z.infer<typeof TeamFormSchema>;
