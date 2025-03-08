import { authenticate } from '@/use-cases/authenticate'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const authenticateRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/authenticate',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate user',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
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

      const { token, user } = await authenticate({
        email,
        password,
      })

      return reply.status(200).send({ token, user })
    }
  )
}
