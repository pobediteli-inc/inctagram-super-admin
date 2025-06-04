import { gql } from '@apollo/client';

export const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(
      email: $email,
      password: $password
    ) {
      logged
    }
  }`
