import {ApolloClient, InMemoryCache, makeVar, gql} from "@apollo/client";

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

export const client = new ApolloClient({
  headers: { authorization: 'Basic [YWRtaW5AZ21haWwuY29tOmFkbWlu]' },
  uri: "https://inctagram.work/api/v1/graphql",
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


