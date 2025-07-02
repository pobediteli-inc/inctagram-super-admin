"use client";

import s from "./page.module.css";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedInVar } from "apollo/client";
import { GET_USERS } from "apollo/queries/users";
import { Pagination, Select, TextField } from "common/components";
import { Block } from "../../assets/icons";
import { DeleteUserModal } from "./modalUsersList/deleteUserModal";
import { ChangeUserStatusDropdown } from "./changeUserStatusDropdown/changeUserStatusDropdown";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "common/constants/paginationConstants";
import { ROUTES } from "common/constants/routes";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "common/components/table/table";
import { useSearch } from "common/hooks/useSearch";
import { BanUserModal } from "./modalUsersList/banUserModal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UnbanUserModal } from "./modalUsersList/unbanUserModal";
import { UserBlockStatus } from "graphql/generated";

export default function UsersList() {
  const isLoggedIn = isLoggedInVar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {searchUser, handleSearch, handleSort, setSearchUser} = useSearch();
  const [isModalOpen, setIsModalOpen] = useState<{ type: string; userId: number } | null>(null);

  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(ROUTES.signInAdmin);
    }
  }, [isLoggedIn, router]);

  const { data, refetch, networkStatus } = useQuery(GET_USERS, {
    variables: {
      pageNumber: currentPage,
      pageSize: pageSize,
      searchTerm: searchUser.searchTerm,
      sortBy: searchUser.sortBy,
      sortDirection: searchUser.sortDirection,
      statusFilter: searchUser.statusFilter === "ALL" ? null : searchUser.statusFilter,
    },
    notifyOnNetworkStatusChange: true,
  });

  const isTableUpdating = networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.setVariables;

  const handleOpenDeleteModal = (userId: number) => {
    setIsModalOpen({ type: "delete", userId });
  };

  const handleOpenBanModal = (userId: number) => {
    setIsModalOpen({ type: "ban", userId });
  };

  const handleOpenUnbanModal = (userId: number) => {
    setIsModalOpen({ type: "unban", userId });
  };

  const handleClose = () => setIsModalOpen(null);

  const statusOptions = [
    { value: UserBlockStatus.All, label: "Not selected" },
    { value: UserBlockStatus.Blocked, label: "Blocked" },
    { value: UserBlockStatus.Unblocked, label: "Not Blocked" },
  ];

  return (
    <div className={s.usersList}>
      <div className={s.wrapper}>
        <div className={s.textFieldAndSelectWrapper}>
          <div className={s.textFieldWrapper}>
            <TextField
              type={"search"}
              variant={"standard"}
              placeholder={"Search"}
              inputChangeHandler={handleSearch}
              value={searchUser.searchTerm}
            />
          </div>
          <div className={s.selectWrapper}>
            <Select
              className={s.selectStatusFilter}
              placeholder="Not selected"
              value={searchUser.statusFilter}
              onValueChange={(value: UserBlockStatus) =>
                setSearchUser({ ...searchUser, statusFilter: value })
              }
              items={statusOptions}
            />
          </div>
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
            {isTableUpdating ? (
              <>
                {[...Array(pageSize)].map((_, index) => (
                  <TableRow key={index} className={s.skeletonRow}>
                    <TableCell colSpan={5} className={s.skeletonCell}>
                      <SkeletonTheme baseColor={"var(--dark-700)"} highlightColor={"var(--dark-300)"}>
                        <Skeleton height={50} />
                      </SkeletonTheme>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              data?.getUsers.users.map((user: User) => (
                <>
                  <TableRow key={user.id}>
                    <TableCell className={s.userBan}>
                      <Block width={24} height={24} color={user.userBan ? "inherit" : "transparent"} />
                      {user.id}
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString().replaceAll("/", ".")}</TableCell>
                    <TableCell>
                      <ChangeUserStatusDropdown
                        onDeleteClick={handleOpenDeleteModal}
                        onBanClick={handleOpenBanModal}
                        onUnbanClick={handleOpenUnbanModal}
                        userId={user.id}
                        isBanned={!!user.userBan}
                      />
                    </TableCell>
                  </TableRow>
                  <DeleteUserModal
                    onCloseAction={handleClose}
                    open={isModalOpen?.type === "delete" && isModalOpen.userId === user.id}
                    username={user.userName}
                    id={user.id}
                    refetch={refetch}
                  />
                  <BanUserModal
                    userId={user.id}
                    isOpen={isModalOpen?.type === "ban" && isModalOpen.userId === user.id}
                    onClose={handleClose}
                    userName={user.userName}
                  />
                  <UnbanUserModal
                    userId={isModalOpen?.type === "unban" ? isModalOpen.userId : 0}
                    userName={data?.getUsers.users.find((u: User) => u.id === isModalOpen?.userId)?.userName || ""}
                    isOpen={isModalOpen?.type === "unban"}
                    onClose={handleClose}
                    refetch={refetch}
                  />
                </>
              ))
            )}
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
