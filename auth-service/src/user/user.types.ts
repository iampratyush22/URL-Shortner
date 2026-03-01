import { Request, Response } from "express";
import { z } from "zod";

export const baseSchema = z.object({
    name: z.string('Please enter name').min(2, 'Name length should be 2 to 20').max(20, 'Name length should be 2 to 20'),
    email: z.email('Please enter valid email'),
    password: z.string().min(6, "Password must be at least 6 characters long").max(18, "Password must not exceed 10 characters")
});

export const registerUserValidator = baseSchema
export const loginUserValidator = baseSchema.omit({
    name: true,
});

export type userData = Omit<z.infer<typeof baseSchema>, 'name'>