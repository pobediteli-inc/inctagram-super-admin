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
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "common/constants/paginationConstants";
import { ROUTES } from "common/constants/routes";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "common/components/table/table";

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

  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(ROUTES.signInAdmin);
    }
  }, [isLoggedIn, router]);

  const { data, refetch } = useQuery(GET_USERS, {
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
      sortDirection: searchUser.sortBy === sortField ? (searchUser.sortDirection === "asc" ? "desc" : "asc") : "asc",
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
        <Table className={s.table}>
          <TableHeader>
            <TableRow>
              <TableHeadCell>User ID</TableHeadCell>
              <TableHeadCell onClick={() => handleSort("userName")}>
                Username {searchUser.sortBy === "userName" && (searchUser.sortDirection === "asc" ? "↑" : "↓")}
              </TableHeadCell>
              <TableHeadCell>Profile Link</TableHeadCell>
              <TableHeadCell onClick={() => handleSort("createdAt")}>
                Date added {searchUser.sortBy === "createdAt" && (searchUser.sortDirection === "asc" ? "↑" : "↓")}
              </TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.getUsers.users.map((user: User) => (
              <>
                <TableRow key={user.id}>
                  <TableCell>
                    {user.userBan && <Block />}
                    {user.id}
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString().replaceAll("/", ".")}</TableCell>
                  <TableCell>
                    <DropdownMenu className={s.dropdown}>
                      <ChangeUserStatusDropdown onDeleteClick={() => handleOpenDeleteModal(user.id)} userId={user.id} />
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <DeleteUserModal
                  onCloseAction={handleClose}
                  open={isModalOpen?.type === "delete" && isModalOpen.userId === user.id}
                  username={user.userName}
                  id={user.id}
                  refetch={refetch}
                />
              </>
            ))}
          </TableBody>
        </Table>

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
