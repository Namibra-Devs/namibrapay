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

// ── Industry Options ─────────────────────────────────────────────

export const INDUSTRY_OPTIONS = [
  { value: "ecommerce", label: "E-commerce & Online Retail" },
  { value: "fintech", label: "Financial Technology" },
  { value: "education", label: "Education & E-learning" },
  { value: "healthcare", label: "Healthcare & Wellness" },
  { value: "logistics", label: "Logistics & Delivery" },
  { value: "hospitality", label: "Hospitality & Travel" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "nonprofit", label: "Non-profit & NGO" },
  { value: "professional_services", label: "Professional Services" },
  { value: "retail", label: "Retail & Point of Sale" },
  { value: "utilities", label: "Utilities & Bill Payments" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "agriculture", label: "Agriculture & Agribusiness" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
] as const;

// ── File Upload Validation ───────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "Only PDF, JPG, and PNG files are accepted"
  );

// ── Sign Up Schema (Multi-Step) ──────────────────────────────────

// Step 1: Business Details
export const businessDetailsSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters.")
    .max(100, "Business name is too long."),
  
  registrationNumber: z
    .string()
    .min(1, "Business registration number is required.")
    .max(50, "Registration number is too long."),
  
  country: z.string().min(1, "Country is required."),
  
  address: z
    .string()
    .min(10, "Please enter your complete business address.")
    .max(200, "Address is too long."),
  
  industry: z.string().min(1, "Please select your industry."),
  
  businessType: z.enum(["starter", "registered"], {
    errorMap: () => ({ message: "Please select your business type." }),
  }),
});

// Step 2: Owner Details
export const ownerDetailsSchema = z.object({
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

  isDeveloper: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please answer this question." }),
  }),
});

// Step 3: KYC Documents
export const kycDocumentsSchema = z.object({
  businessRegistrationCertificate: fileSchema,
  directorId: fileSchema,
  proofOfAddress: fileSchema,
});

// Step 4: Payout Account
export const payoutAccountSchema = z.object({
  bankName: z
    .string()
    .min(1, "Bank name is required.")
    .max(100, "Bank name is too long."),
  
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 digits.")
    .max(20, "Account number is too long.")
    .regex(/^[\d]+$/, "Account number can only contain digits."),
  
  accountName: z
    .string()
    .min(2, "Account name is required.")
    .max(100, "Account name is too long."),
});

// Step 5: Security
export const securitySchema = z.object({
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[0-9]/, "Include at least one number.")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character."),
  
  passwordConfirm: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match.",
  path: ["passwordConfirm"],
});

// Step 6: Terms & Conditions
export const termsSchema = z.object({
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service to continue.",
  }),
  acceptedPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must accept the Privacy Policy to continue.",
  }),
});

// Combined Sign Up Schema (all steps)
export const signUpSchema = businessDetailsSchema
  .merge(ownerDetailsSchema)
  .merge(kycDocumentsSchema)
  .merge(payoutAccountSchema)
  .merge(securitySchema)
  .merge(termsSchema);

export type SignUpValues = z.infer<typeof signUpSchema>;
export type BusinessDetailsValues = z.infer<typeof businessDetailsSchema>;
export type OwnerDetailsValues = z.infer<typeof ownerDetailsSchema>;
export type KYCDocumentsValues = z.infer<typeof kycDocumentsSchema>;
export type PayoutAccountValues = z.infer<typeof payoutAccountSchema>;
export type SecurityValues = z.infer<typeof securitySchema>;
export type TermsValues = z.infer<typeof termsSchema>;

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
