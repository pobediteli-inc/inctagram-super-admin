"use client"

import styles from "./page.module.css";
import {useQuery} from "@apollo/client";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {GET_AUTH_STATUS} from "../../apollo/client";
import {GET_USERS} from "../../apollo/queries/users";


export default function UsersList() {
  const { data: loginStatus } = useQuery(GET_AUTH_STATUS);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

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

  return <div className={styles.usersList}>Users list</div>;
}
