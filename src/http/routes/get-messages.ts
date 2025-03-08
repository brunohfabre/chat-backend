import { getMessages } from '@/use-cases/get-messages'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { verifyJwt } from '../hooks/auth'

export const getMessagesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/messages',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Messages'],
        summary: 'Get messages',
        security: [{ bearerAuth: [] }],
        response: {
          201: z.object({
            messages: z.array(
              z.object({
                id: z.string(),
                content: z.string(),
                createdAt: z.coerce.date(),
                user: z.object({
                  id: z.string(),
                  email: z.string(),
                  firebaseId: z.string(),
                  createdAt: z.coerce.date(),
                }),
              })
            ),
          }),
        },
      },
    },
    async (_, reply) => {
      const { messages } = await getMessages()

      return reply.status(200).send({ messages })
    }
  )
}
