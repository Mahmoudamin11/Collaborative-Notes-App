import mongoose from "mongoose";
import { z } from "zod";

export const collaboratorRoles = ["viewer", "editor"] as const;

export type CollaboratorRole = (typeof collaboratorRoles)[number];

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(50, "Title cannot exceed 50 characters"),

  content: z.string().trim().default(""),
}).strict();

export const updateNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(50, "Title cannot exceed 50 characters").optional(),
  content: z.string().trim().optional(),
}).strict();

export const noteParamsSchema = z.object({
  noteId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid note ID",
  }),
});

export const addCollaboratorSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),
  role: z
    .enum(collaboratorRoles, {
      error: () => "Role must be either 'viewer' or 'editor'",
    })
    .default("viewer"),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;
