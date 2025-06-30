"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_USER } from "apollo/queries/users";
import { Avatar, TabsMenu, Typography } from "common/components";
import React, { useState } from "react";
import { ROUTES } from "common/constants/routes";
import { ArrowBackOutline } from "assets/icons";
import { TabItem } from "common/components/tabsMenu/tabsMenu";
import { UploadedPhotos } from "../uploadedPhotos/uploadedPhotos";
import s from "./user.module.css";
import { Payments } from "../payments/payments";
import Link from "next/link";
import { Followers } from "../followers/followers";
import { Following } from "../following/following";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "common/constants/paginationConstants";

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.userId);
  const { data } = useQuery(GET_USER, {
    variables: { userId },
  });

  const [activeTab, setActiveTab] = useState("uploadedPhotos");

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);

    if (tabValue === "uploadedPhotos") {
      router.push(ROUTES.user(userId));
    } else {
      const newQuery = new URLSearchParams();
      newQuery.set("page", DEFAULT_PAGE.toString());
      newQuery.set("size", DEFAULT_PAGE_SIZE.toString());

      router.push(`${ROUTES.user(userId)}?${newQuery.toString()}`);
    }
  };

  const tabs: TabItem[] = [
    { value: "uploadedPhotos", title: "Uploaded Photos", component: <UploadedPhotos userId={userId} /> },
    { value: "payments", title: "Payments", component: <Payments userId={userId} /> },
    { value: "followers", title: "Followers", component: <Followers userId={userId} /> },
    { value: "following", title: "Following", component: <Following userId={userId} /> },
  ];
  return (
    <div className={s.page}>
      <Link href={ROUTES.usersList} className={s.backLink}>
        <ArrowBackOutline width={24} height={24} />
        <Typography asChild variant={"medium_14"}>
          <span>Back to Users List</span>
        </Typography>
      </Link>
      <div className={s.userMainInfo}>
        <Avatar size={"medium"} src={data?.getUser.profile.avatars[0]?.url} />
        <div>
          <Typography variant={"h1"}>
            {data?.getUser.profile.firstName}&nbsp;{data?.getUser.profile.lastName}
          </Typography>
          <Link href={ROUTES.publicUser(userId)} className={s.username}>
            <Typography variant={"regular_14"}>{data?.getUser.profile.userName}</Typography>
          </Link>
        </div>
      </div>
      <div className={s.userAccountInfo}>
        <div>
          <Typography variant={"regular_14"} className={s.infoSubtitle}>
            UserID
          </Typography>
          <Typography variant={"regular_16"}>{data?.getUser.id}</Typography>
        </div>
        <div>
          <Typography variant={"regular_14"} className={s.infoSubtitle}>
            Profile Creation Date
          </Typography>
          <Typography variant={"regular_16"}>
            {new Date(data?.getUser.profile.createdAt).toLocaleDateString("ru-RU")}
          </Typography>
        </div>
      </div>
      <TabsMenu tabs={tabs} activeTabValue={activeTab} setActiveTabValue={handleTabChange} />
    </div>
  );
}
