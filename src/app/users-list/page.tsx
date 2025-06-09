"use client";

import styles from "./page.module.css";
import s from "./page.module.css";
import { useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GET_AUTH_STATUS } from "apollo/client";
import { GET_USERS } from "apollo/queries/users";
import { Pagination, TextField } from "common/components";
import { Block } from "../../assets/icons";
import { SortDirectionProps } from "common/types/SortDirectionProps/SortDirectionProps";

const initialSearchState: SearchUser = {
  searchTerm: "",
  sortBy: "userName",
  sortDirection: "desc",
};

export default function UsersList() {
  const { data: loginStatus } = useQuery(GET_AUTH_STATUS);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchUser, setSearchUser] = useState<SearchUser>(initialSearchState);

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("size")) || 8;

  useEffect(() => {
    if (!loginStatus?.isLoggedIn) {
      router.replace("/sign-in-admin");
    }
  }, [loginStatus, router]);

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      pageNumber: currentPage,
      pageSize: pageSize,
      searchTerm: searchUser.searchTerm,
      sortBy: searchUser.sortBy,
      sortDirection: searchUser.sortDirection,
      statusFilter: "ALL",
    },
  });

  const handleSort = (sortField: SortBy) => {
    setSearchUser({
      ...searchUser,
      sortBy: sortField,
      sortDirection: searchUser.sortBy === sortField ? (searchUser.sortDirection === "asc" ? "desc" : "asc") : "desc",
    });
  };
  const handleSearch = (searchTerm: string) => setSearchUser({ ...searchUser, searchTerm });

  return (
    <div className={styles.usersList}>
      <div className={s.wrapper}>
        <div className={s.textFieldWrapper}>
          <TextField type={"search"} variant={"standard"} placeholder={"Search"} inputChangeHandler={handleSearch}
                     value={searchUser.searchTerm} />
        </div>
        <table className={s.table}>
          <thead>
          <tr>
            <th className={s.cell}>User ID</th>
            <th className={s.cell} onClick={() => handleSort("userName")}>
              Username {searchUser.sortBy === "userName" && (searchUser.sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className={s.cell}>Profile Link</th>
            <th className={s.cell} onClick={() => handleSort("createdAt")}>
              Date added {searchUser.sortBy === "createdAt" && (searchUser.sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
          </thead>
          <tbody>
          {data?.getUsers.users.map((user: User) => (
            <tr key={user.id}>
              <td className={s.cell}>{user.userBan && <Block />}{user.id}</td>
              <td className={s.cell}>{user.userName}</td>
              <td className={s.cell}>{user.email}</td>
              <td className={s.cell}>{new Date(user.createdAt).toLocaleDateString().replaceAll("/", ".")}</td>
            </tr>
          ))}
          </tbody>
        </table>

        <Pagination totalPages={data?.getUsers?.pagination?.pagesCount} />
      </div>
    </div>
  );
}

type User = {
  id: number
  userName: string
  email: string
  createdAt: Date
  userBan: null | { createdAt: Date; reason: string }
}
type SortBy = "userName" | "createdAt";
type SearchUser = {
  searchTerm: string;
  sortBy: SortBy;
  sortDirection: SortDirectionProps;
}
