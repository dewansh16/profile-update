import { z } from "zod";

export const ProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  profilePhoto: z.string().url("Invalid photo URL"),
});

export type ProfileFormTypes = z.infer<typeof ProfileFormSchema>;
