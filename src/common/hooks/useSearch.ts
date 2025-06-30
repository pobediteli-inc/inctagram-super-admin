import { useState } from "react";
import { SortBy } from "apollo/queries/users.types";
import { SortDirection } from "graphql/generated";

const initialSearchState: SearchUser = {
  searchTerm: "",
  sortBy: "userName",
  sortDirection: SortDirection.Desc,
};

export const useSearch = () => {
  const [searchUser, setSearchUser] = useState<SearchUser>(initialSearchState);

  const handleSort = (sortField: SortBy) => {
    setSearchUser({
      ...searchUser,
      sortBy: sortField,
      sortDirection: searchUser.sortBy === sortField ? (searchUser.sortDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc) : SortDirection.Asc,
    });
  };
  const handleSearch = (searchTerm: string) => setSearchUser({ ...searchUser, searchTerm });

  return {
    searchUser,
    handleSort,
    handleSearch,
    setSearchUser,
  };
};

type SearchUser = {
  searchTerm: string;
  sortBy: SortBy;
  sortDirection: SortDirection;
};
