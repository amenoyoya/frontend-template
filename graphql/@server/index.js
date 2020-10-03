/**
 * Apollo Server + GraphQL
 * $ node @server/index.js
 */
const {ApolloServer} = require('apollo-server')
const typeDefs = require('./schema')

/**
 * Apollo Server + GraphQL 起動
 * http://localhost:4000
 */
const server = new ApolloServer({typeDefs})
server.listen(process.env.PORT || 4000).then(({url}) => {
  console.log(`🚀 Apollo Server: ${url}`)
})