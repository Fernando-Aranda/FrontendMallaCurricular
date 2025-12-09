import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3000/graphql", // ⬅️ tu backend NestJS GraphQL
  }),
  cache: new InMemoryCache(),
});
