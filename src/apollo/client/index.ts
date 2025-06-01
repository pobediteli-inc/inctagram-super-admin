import {ApolloClient, InMemoryCache} from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://inctagram.work/api/v1/graphql",
  cache: new InMemoryCache(),
});
