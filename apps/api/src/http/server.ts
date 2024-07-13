import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { requestPasswordRecovery } from '@/http/routes//auth/request-password-recovery'
import { authenticateWithGithub } from '@/http/routes/auth/authenticate-with-github'
import { authenticateWithPassword } from '@/http/routes/auth/authenticate-with-password'
import { createAccount } from '@/http/routes/auth/create-account'
import { getProfile } from '@/http/routes/auth/get-profile'
import { resetPassword } from '@/http/routes/auth/reset-password'
import { createOrganization } from '@/http/routes/orgs/create-organization'
import { getMembership } from '@/http/routes/orgs/get-membership'
import { getOrganization } from '@/http/routes/orgs/get-organization'
import { getOrganizations } from '@/http/routes/orgs/get-organizations'

import { errorHandler } from './error-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecovery)
app.register(resetPassword)
app.register(authenticateWithGithub)
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running!')
})
