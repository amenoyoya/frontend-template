/**
 * Apollo Server + GraphQL
 * $ node server.js
 */
const {ApolloServer, gql} = require('apollo-server')

/**
 * スキーマ定義
 * @type Book: title, author 文字列カラムを持つデータ構造
 * @type Query: GraphQL で処理するクエリ
 *    - booksクエリ: Bookデータの配列を返す
 */
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

/**
 * 上記 Query で定義したクエリの実装
 */
const resolvers = {
  Query: {
    /**
     * booksクエリ: Bookデータの配列を返す（ここではJSON定数データを返す）
     */
    books() {
      return [
        {
          title: "Harry Potter and the Chamber of Secrets",
          author: "J.K. Rowling"
        },
        {
          title: "Jurassic Park",
          author: "Michael Crishton"
        }
      ]
    }
  }
}

/**
 * Apollo Server + GraphQL 起動
 * http://localhost:4000
 */
const server = new ApolloServer({typeDefs, resolvers})
server.listen(process.env.PORT || 4000).then(({url}) => {
  console.log(`🚀 Apollo Server: ${url}`)
})