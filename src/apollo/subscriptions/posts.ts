import { gql } from "@apollo/client";

export const POST_ADDED = gql`
  subscription PostAdded {
    postAdded {
      id
      description
      createdAt
      images {
        id
        url
      }
      postOwner {
        id
        userName
        avatars {
          url
        }
      }
    }
  }
`;
