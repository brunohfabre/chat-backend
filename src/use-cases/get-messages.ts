import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface GetMessagesResponse {
  messages: Prisma.MessageGetPayload<{
    include: {
      user: true
    }
  }>[]
}

export async function getMessages(): Promise<GetMessagesResponse> {
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      user: true,
    },
  })

  return {
    messages,
  }
}
