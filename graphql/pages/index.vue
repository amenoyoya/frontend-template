<template>
  <section class="container">
    <table class="table-auto">
      <thead>
        <tr class="text-center bg-gray-400">
          <th class="border-2 border-gray-600 px-4 py-2">Title</th>
          <th class="border-2 border-gray-600 px-4 py-2">Author</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in books" :key="index">
          <td class="border-2 border-gray-400 px-4 py-2">{{book.title}}</td>
          <td class="border-2 border-gray-400 px-4 py-2">{{book.author}}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data: () => ({
    books: [] // replace by apollo/graphql
  }),
  /**
   * @nuxtjs/apollo
   * - Get books query
   */
  apollo: {
    books: {
      query: gql`
        query {
          books {
            title, author
          }
        }
      `
    }
  }
}
</script>
