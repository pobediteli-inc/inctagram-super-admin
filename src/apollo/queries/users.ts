import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers(
    $pageNumber: Int = 1
    $pageSize: Int = 8
    $searchTerm: String
    $sortBy: String = "createdAt"
    $sortDirection: SortDirection = desc
    $statusFilter: UserBlockStatus = ALL
  ) {
    getUsers(
      pageNumber: $pageNumber
      pageSize: $pageSize
      searchTerm: $searchTerm
      sortBy: $sortBy
      sortDirection: $sortDirection
      statusFilter: $statusFilter
    ) {
      pagination {
        page
        pageSize
        pagesCount
        totalCount
      }
      users {
        id
        userName
        email
        createdAt
        profile {
          aboutMe
          avatars {
            url
            fileSize
            width
            height
          }
          firstName
          lastName
          city
          country
          region
          dateOfBirth
        }
        userBan {
          createdAt
          reason
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      id
      userName
      email
      createdAt
      profile {
        aboutMe
        avatars {
          fileSize
          height
          url
          width
        }
        city
        country
        createdAt
        dateOfBirth
        firstName
        id
        lastName
        region
        userName
      }
      userBan {
        createdAt
        reason
      }
    }
  }
`;
