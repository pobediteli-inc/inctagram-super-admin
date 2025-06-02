"use client"

import styles from "./page.module.css";
import {useQuery} from "@apollo/client";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import {GET_AUTH_STATUS} from "../../apollo/client";
import {GET_USERS} from "../../apollo/queries/users";
import {Pagination} from "../../common/components";
import s from './page.module.css'
import {Block} from "../../assets/icons";

type User = {
  id: number
  userName: string
  email: string
  createdAt: Date
  userBan: null | {createdAt: Date; reason: string}
}

export default function UsersList() {
  const { data: loginStatus } = useQuery(GET_AUTH_STATUS);
  const router = useRouter();
  const searchParams = useSearchParams();
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
      sortBy: 'userName',
      sortDirection: 'asc',
      statusFilter: 'ALL',
    },
  });
  console.log(data)

  //const paginatedData = data?.getUsers.users.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

  return <div className={styles.usersList}>
    <div className={s.wrapper}>
      <table className={s.table}>
        <thead>
        <tr>
          <th className={s.cell}>User ID</th>
          <th className={s.cell}>Username</th>
          <th className={s.cell}>Profile Link</th>
          <th className={s.cell}>Date added</th>
        </tr>
        </thead>
        <tbody>
        {data?.getUsers.users.map((user: User) => (
          <tr key={user.id}>
            <td className={s.cell}>{user.userBan && <Block />}{user.id}</td>
            <td className={s.cell}>{user.userName}</td>
            <td className={s.cell}>{user.email}</td>
            <td className={s.cell}>{new Date(user.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <Pagination totalPages={data?.getUsers?.pagination?.pagesCount} />
    </div>
  </div>;
}
