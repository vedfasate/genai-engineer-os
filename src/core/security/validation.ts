import { z } from 'zod'

export const emailSchema = z.string().email()
export const userNameSchema = z.string().min(2)
