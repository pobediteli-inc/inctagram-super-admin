"use client";

import styles from "./page.module.css";
import { useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { GET_AUTH_STATUS } from "../../apollo/client";
import { GET_USERS } from "../../apollo/queries/users";
import { Pagination } from "../../common/components";
import s from "./page.module.css";
import { Block } from "../../assets/icons";
import { DeleteUserModal } from "./modalUsersList/deleteUserModal";
import { ChangeUserStatusDropdown } from "./changeUserStatusDropdown/changeUserStatusDropdown";

type User = {
  id: number;
  userName: string;
  email: string;
  createdAt: Date;
  userBan: null | { createdAt: Date; reason: string };
};

export default function UsersList() {
  const { data: loginStatus } = useQuery(GET_AUTH_STATUS);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("size")) || 8;
  const [isModalOpen, setIsModalOpen] = useState<{ type: string; userId: number } | null>(null);

  useEffect(() => {
    if (!loginStatus?.isLoggedIn) {
      router.replace("/sign-in-admin");
    }
  }, [loginStatus, router]);

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      pageNumber: currentPage,
      pageSize: pageSize,
      sortBy: "userName",
      sortDirection: "asc",
      statusFilter: "ALL",
    },
  });

  const handleOpenDeleteModal = (userId: number) => {
    setIsModalOpen({ type: "delete", userId });
  };

  const handleClose = () => setIsModalOpen(null);

  return (
    <div className={styles.usersList}>
      <div className={s.wrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.cell}>User ID</th>
              <th className={s.cell}>Username</th>
              <th className={s.cell}>Profile Link</th>
              <th className={s.cell}>Date added</th>
              <th className={s.cell}></th>
            </tr>
          </thead>
          <tbody>
            {data?.getUsers.users.map((user: User) => (
              <Fragment key={user.id}>
                <tr>
                  <td className={s.cell}>
                    {user.userBan && <Block />}
                    {user.id}
                  </td>
                  <td className={s.cell}>{user.userName}</td>
                  <td className={s.cell}>{user.email}</td>
                  <td className={s.cell}>{new Date(user.createdAt).toLocaleDateString().replaceAll("/", ".")}</td>
                  <td className={s.cell}>
                    <ChangeUserStatusDropdown onDeleteClick={() => handleOpenDeleteModal(user.id)} userId={user.id} />
                  </td>
                </tr>
                <DeleteUserModal
                  onCloseAction={handleClose}
                  open={isModalOpen?.type === "delete" && isModalOpen.userId === user.id}
                  username={user.userName}
                  id={user.id}
                />
              </Fragment>
            ))}
          </tbody>
        </table>

        <Pagination totalPages={data?.getUsers?.pagination?.pagesCount} />
      </div>
    </div>
  );
}
