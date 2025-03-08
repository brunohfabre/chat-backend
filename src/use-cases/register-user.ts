import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/lib/firebase'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/modules/auth'
import type { User } from '@prisma/client'
import { createUserWithEmailAndPassword } from 'firebase/auth'

interface RegisterUserRequest {
  email: string
  password: string
}

interface RegisterUserResponse {
  token: string
  user: User
}

export async function registerUser({
  email,
  password,
}: RegisterUserRequest): Promise<RegisterUserResponse> {
  const userFromEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (userFromEmail) {
    throw new BadRequestError('Este e-mail já está em uso.')
  }

  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  const user = await prisma.user.create({
    data: {
      firebaseId: userCredentials.user.uid,
      email,
    },
  })

  const { token } = await authenticateUser({ userId: user.id })

  return {
    token,
    user,
  }
}
