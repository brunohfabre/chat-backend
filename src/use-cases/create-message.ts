import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface CreateMessageRequest {
  content: string
  userId: string
}

interface CreateMessageResponse {
  message: Prisma.MessageGetPayload<{
    include: {
      user: true
    }
  }>
}

export async function createMessage({
  content,
  userId,
}: CreateMessageRequest): Promise<CreateMessageResponse> {
  const message = await prisma.message.create({
    data: {
      content,
      userId,
    },
    include: {
      user: true,
    },
  })

  return {
    message,
  }
}
