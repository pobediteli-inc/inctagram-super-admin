"use client"

import styles from "./page.module.css";
import {useQuery} from "@apollo/client";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {GET_AUTH_STATUS} from "../../apollo/client";


export default function UsersList() {
  const { data } = useQuery(GET_AUTH_STATUS);
  const router = useRouter();

  useEffect(() => {
    if (!data?.isLoggedIn) {
      router.replace("/sign-in-admin");
    }
  }, [data, router]);

  return <div className={styles.usersList}>Users list</div>;
}
