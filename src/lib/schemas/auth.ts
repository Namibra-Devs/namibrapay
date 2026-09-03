import { z } from "zod";

// ── Sign In ──────────────────────────────────────────────────────

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type SignInValues = z.infer<typeof signInSchema>;

// ── Sign Up ──────────────────────────────────────────────────────

export const signUpSchema = z.object({
  country: z.string().min(1, "Country is required."),

  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters.")
    .max(100, "Business name is too long."),

  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50, "First name is too long."),

  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name is too long."),

  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  phoneCode: z.string().min(1),

  phone: z
    .string()
    .min(5, "Enter a valid phone number.")
    .regex(/^[\d\s\-()+]+$/, "Phone number can only contain digits."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),

  businessType: z.enum(["starter", "registered"]),

  isDeveloper: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please answer this question." }),
  }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// ── Forgot Password ──────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

// ── Reset Password ───────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[0-9]/, "Include at least one number."),
    passwordConfirm: z.string().min(1, "Please confirm your password."),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
