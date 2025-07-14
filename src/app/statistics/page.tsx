"use client"

import styles from "./page.module.css";
import {useEffect} from "react";
import {ROUTES} from "../../common/constants/routes";
import {isLoggedInVar} from "../../apollo/client";
import {useRouter} from "next/navigation";

export default function Statistics() {
  const isLoggedIn = isLoggedInVar();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(ROUTES.signInAdmin);
    }
  }, [isLoggedIn, router]);

  return <div className={styles.statistics}>Statistics</div>;
}
