import { z } from 'zod'

export type ProjectType =
  | 'Supplement'
  | 'Rehabilitation'
  | 'Arch. Restoration'
  | 'Sewage Replacement'
  | 'Schools Rehab'
  | 'Water Supply'
  | 'Supply'
  | 'Rehab/Solar'
  | 'Infrastructure'

export interface IProject {
  _id?: string
  name: string
  donor?: string
  value?: string
  startDate?: string
  endDate?: string
  projectType: ProjectType
}

export const ProjectFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(30, 'Title must be 30 characters or less'),
  donor: z
    .string()
    .max(30, 'Donor name must be 30 characters or less')
    .optional()
    .or(z.literal('')),

  value: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  projectType: z.string().min(1, 'Project Type is required')
})

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>
