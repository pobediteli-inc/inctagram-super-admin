"use client";

import s from "./page.module.css";
import { useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedInVar } from "apollo/client";
import { GET_USERS } from "apollo/queries/users";
import { DropdownMenu, Pagination, TextField } from "common/components";
import { Block } from "../../assets/icons";
import { SortDirectionProps } from "common/types/SortDirectionProps/SortDirectionProps";
import { DeleteUserModal } from "./modalUsersList/deleteUserModal";
import { ChangeUserStatusDropdown } from "./changeUserStatusDropdown/changeUserStatusDropdown";

const initialSearchState: SearchUser = {
  searchTerm: "",
  sortBy: "userName",
  sortDirection: "desc",
};

export default function UsersList() {
  const isLoggedIn = isLoggedInVar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchUser, setSearchUser] = useState<SearchUser>(initialSearchState);
  const [isModalOpen, setIsModalOpen] = useState<{ type: string; userId: number } | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("size")) || 8;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/sign-in-admin");
    }
  }, [isLoggedIn, router]);

  const { data } = useQuery(GET_USERS, {
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
  const handleOpenDeleteModal = (userId: number) => {
    setIsModalOpen({ type: "delete", userId });
  };
  const handleClose = () => setIsModalOpen(null);

  return (
    <div className={s.usersList}>
      <div className={s.wrapper}>
        <div className={s.textFieldWrapper}>
          <TextField
            type={"search"}
            variant={"standard"}
            placeholder={"Search"}
            inputChangeHandler={handleSearch}
            value={searchUser.searchTerm}
          />
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
              <>
                <tr key={user.id}>
                  <td className={s.cell}>
                    {user.userBan && <Block />}
                    {user.id}
                  </td>
                  <td className={s.cell}>{user.userName}</td>
                  <td className={s.cell}>{user.email}</td>
                  <td className={s.cell}>{new Date(user.createdAt).toLocaleDateString().replaceAll("/", ".")}</td>
                  <td className={s.cell}>
                    <DropdownMenu className={s.dropdown}>
                      <ChangeUserStatusDropdown onDeleteClick={() => handleOpenDeleteModal(user.id)} userId={user.id} />
                    </DropdownMenu>
                  </td>
                </tr>
                <DeleteUserModal
                  onCloseAction={handleClose}
                  open={isModalOpen?.type === "delete" && isModalOpen.userId === user.id}
                  username={user.userName}
                  id={user.id}
                />
              </>
            ))}
          </tbody>
        </table>

        <Pagination totalPages={data?.getUsers?.pagination?.pagesCount} />
      </div>
    </div>
  );
}

type User = {
  id: number;
  userName: string;
  email: string;
  createdAt: Date;
  userBan: null | { createdAt: Date; reason: string };
};
type SortBy = "userName" | "createdAt";
type SearchUser = {
  searchTerm: string;
  sortBy: SortBy;
  sortDirection: SortDirectionProps;
};
