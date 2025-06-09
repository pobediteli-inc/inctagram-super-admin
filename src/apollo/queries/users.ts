import {gql} from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers(
    $pageNumber: Int = 1,
    $pageSize: Int = 8,
    $searchTerm: String,
    $sortBy: String = "createdAt",
    $sortDirection: SortDirection = desc,
    $statusFilter: UserBlockStatus = ALL
  ) {
    getUsers(
      pageNumber: $pageNumber,
      pageSize: $pageSize,
      searchTerm: $searchTerm,
      sortBy: $sortBy,
      sortDirection: $sortDirection,
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
