import { z } from "zod"

export const EmailSignInFormSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const EmailSignUpFormSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .max(50, { message: "Password must be between 8 - 50 characters." })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number."
        ),
})

export const ProfileSetupFormSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    username: z.string().max(30, {
        message: 'Username must be less than 30 characters.'
    })
})

export const EmailAndProfileSignUpSchema = z.intersection(EmailSignUpFormSchema, ProfileSetupFormSchema)

export const PhotoUploadSchema = z.object({
    photo: z.union([
        z.instanceof(File)
            .refine(
                (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
                "Only .jpg, .png, and .webp formats are supported."
            )
            .refine(
                (file) => file.size <= 5000000,
                "File size should be less than 5MB."
            ),
        z.undefined()
    ])
})