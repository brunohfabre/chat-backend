import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { Server } from 'socket.io'
import { errorHandler } from './error-handler'
import { authenticateRoute } from './routes/authenticate'
import { createMessageRoute } from './routes/create-message'
import { getMessagesRoute } from './routes/get-messages'
import { registerUserRoute } from './routes/register-user'

const app = fastify()

export const io = new Server(app.server, { cors: { origin: '*' } })

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Chat API',
      description: 'Backend service to chat application',
      version: '1.0.0',
    },
    servers: [],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(registerUserRoute)
app.register(authenticateRoute)
app.register(createMessageRoute)
app.register(getMessagesRoute)

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => console.log('HTTP Server running on port 3333'))
