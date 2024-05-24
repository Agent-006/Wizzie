import * as z from 'zod'

export const UserValidationSchema = z.object({
    profile_photo: z.string().url().min(1),
    name: z.string().min(3, { message: 'name should be atleat of 3 characters' }).max(30),
    username: z.string().min(3, { message: 'username should be atleat of 3 characters' }).max(30),
    bio: z.string().min(3, { message: 'bio should be atleat of 3 characters' }).max(1000),
})