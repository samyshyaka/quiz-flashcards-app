import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'

const server = new ApolloServer({
    schema,
    context,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()]
})

const port = process.env.PORT || 3000

server.listen({port}).then(({ url }) => {
    console.log(`🚀 server running at ${url}`)
})