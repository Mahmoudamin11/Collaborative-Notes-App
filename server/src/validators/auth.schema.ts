import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string("Name is required")
    .min(4, "Name must be at least 4 characters")
    .max(30, "Name cannot exceed 30 characters")
    .trim(),

  email: z
    .string("Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .pipe(
      z
        .string()
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    ),
});

export const LoginSchema = z.object({
  email: z.string("Email is required").email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

/**
 * Used when a user updates their profile.
 * .partial() makes every field optional — update only what's sent.
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
