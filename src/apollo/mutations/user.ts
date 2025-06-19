import { gql } from "@apollo/client";

export const BAN_USER = gql`
  mutation BanUser($banReason: String!, $userId: Int!) {
    banUser(banReason: $banReason, userId: $userId)
  }
`;
