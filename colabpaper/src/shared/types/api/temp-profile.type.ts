import { z } from 'zod'

export const TempProfilePOSTSchema = z.object({
    user_id: z.string().uuid(),
    first_name: z.string(),
    last_name: z.string(),
    username: z.string().max(30),
    email: z.string().email()
})