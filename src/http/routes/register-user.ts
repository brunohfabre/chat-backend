import { registerUser } from '@/use-cases/register-user'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const registerUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Register user',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
            user: z.object({
              id: z.string(),
              email: z.string(),
              firebaseId: z.string(),
              createdAt: z.coerce.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { token, user } = await registerUser({
        email,
        password,
      })

      return reply.status(201).send({ token, user })
    }
  )
}
