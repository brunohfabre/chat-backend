import { io } from '@/http/server'
import { createMessage } from '@/use-cases/create-message'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { verifyJwt } from '../hooks/auth'

export const createMessageRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/messages',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Messages'],
        summary: 'Create message',
        security: [{ bearerAuth: [] }],
        body: z.object({
          content: z.string(),
        }),
        response: {
          201: z.object({
            message: z.object({
              id: z.string(),
              content: z.string(),
              createdAt: z.coerce.date(),
              user: z.object({
                id: z.string(),
                email: z.string(),
                firebaseId: z.string(),
                createdAt: z.coerce.date(),
              }),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { content } = request.body

      const userId = request.user.sub

      const { message } = await createMessage({
        content,
        userId,
      })

      io.emit('new-message', { message })

      return reply.status(201).send({ message })
    }
  )
}
