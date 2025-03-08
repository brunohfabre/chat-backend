import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/lib/firebase'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/modules/auth'
import type { User } from '@prisma/client'
import { signInWithEmailAndPassword } from 'firebase/auth'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  user: User
  token: string
}

export async function authenticate({
  email,
  password,
}: AuthenticateRequest): Promise<AuthenticateResponse> {
  const userFromEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (!userFromEmail) {
    throw new BadRequestError('Credenciais inválidas.')
  }

  await signInWithEmailAndPassword(auth, email, password)

  const { token } = await authenticateUser({
    userId: userFromEmail.id,
  })

  return {
    token,
    user: userFromEmail,
  }
}
