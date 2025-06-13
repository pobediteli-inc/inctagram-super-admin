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

export const GET_POSTS_BY_USER = gql`
  query GetPostsByUser($userId: Int!, $endCursorId: Int) {
    getPostsByUser(userId: $userId, endCursorId: $endCursorId) {
      items {
        id
        url
        createdAt
        width
        height
        fileSize
      }
      pageSize
      pagesCount
      totalCount
    }
  }
`;

export const GET_PAYMENTS_BY_USER = gql`
  query GetPaymentsByUser(
    $pageNumber: Int = 1
    $pageSize: Int = 10
    $sortBy: String = "createdAt"
    $sortDirection: SortDirection = desc
    $userId: Int!
  ) {
    getPaymentsByUser(
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      userId: $userId
    ) {
      items {
        businessAccountId
        dateOfPayment
        endDate
        id
        paymentType
        price
        startDate
        status
        type
        payments {
          amount
          createdAt
          currency
          endDate
          id
          paymentMethod
          type
          userId
        }
      }
      page
      pageSize
      pagesCount
      totalCount
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query GetFollowers(
    $pageNumber: Int = 1
    $pageSize: Int = 10
    $sortBy: String = "createdAt"
    $sortDirection: SortDirection = desc
    $userId: Int!
  ) {
    getFollowers(
      pageNumber: $pageNumber
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      userId: $userId
    ) {
      items {
        createdAt
        firstName
        id
        lastName
        userId
        userName
      }
      page
      pageSize
      pagesCount
      totalCount
    }
  }
`;
