import * as z from 'zod'

export const CommentValidationSchema = z.object({
    spell: z.string().min(3, { message: 'Minimum 3 characters' }),
    accountId: z.string(),
})