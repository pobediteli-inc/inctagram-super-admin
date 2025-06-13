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

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId;
  const { data } = useQuery(GET_USER, {
    variables: { userId: Number(userId) },
  });
  const handleBackLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (document.referrer === "") {
      router.push(ROUTES.usersList);
    } else {
      router.back();
    }
  };

  const [activeTab, setActiveTab] = useState("uploadedPhotos");

  const tabs: TabItem[] = [
    { value: "uploadedPhotos", title: "Uploaded Photos", component: <UploadedPhotos userId={Number(userId)} /> },
    { value: "payments", title: "Payments", component: <Payments /> },
    { value: "followers", title: "Followers", component: <div>followers</div> },
    { value: "following", title: "Following", component: <div>following</div> },
  ];
  return (
    <div className={s.page}>
      <a href="#" onClick={handleBackLinkClick} className={s.backLink}>
        <ArrowBackOutline width={24} height={24} />
        <Typography asChild variant={"medium_14"}>
          <span>Back to Users List</span>
        </Typography>
      </a>
      <div className={s.userMainInfo}>
        <Avatar size={"medium"} src={data?.getUser.profile.avatars[0]?.url} />
        <div>
          <Typography variant={"h1"}>
            {data?.getUser.profile.firstName}&nbsp;{data?.getUser.profile.lastName}
          </Typography>
          <Typography variant={"regular_14"} className={s.username}>
            {data?.getUser.profile.userName}
          </Typography>
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
      <TabsMenu tabs={tabs} activeTabValue={activeTab} setActiveTabValue={setActiveTab} />
    </div>
  );
}
