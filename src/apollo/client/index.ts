import {ApolloClient, InMemoryCache, makeVar, gql, HttpLink, split} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";
import {createClient} from "graphql-ws";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";

export const isLoggedInVar = makeVar(false);

// Define the query for auth status
export const GET_AUTH_STATUS = gql`
  query GetAuthStatus {
    isLoggedIn
  }
`;

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          }
        }
      }
    }
  }
});

// Создание HTTP-линка
const httpLink = new HttpLink({
  headers: { authorization: 'Basic [YWRtaW5AZ21haWwuY29tOmFkbWlu]' },
  uri: "https://inctagram.work/api/v1/graphql",
});

// Создание WebSocket-клиента с помощью graphql-ws
const wsClient = createClient({
  url: "wss://inctagram.work/api/v1/graphql", // WebSocket URL
  connectionParams: {
    authorization: 'Basic [YWRtaW5AZ21haWwuY29tOmFkbWlu]', // Передача токена авторизации
  },
});

// Создание WebSocket-линка
const wsLink = new GraphQLWsLink(wsClient);

// Разделение запросов между HTTP и WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Для подписок
  httpLink // Для запросов и мутаций
);

export const client = new ApolloClient({
  link: splitLink,
  cache: cache,
});

// Helper function to update login state
export const updateLoginState = (isLoggedIn: boolean) => {
  isLoggedInVar(isLoggedIn);
  client.writeQuery({
    query: GET_AUTH_STATUS,
    data: {
      isLoggedIn
    }
  });
};


