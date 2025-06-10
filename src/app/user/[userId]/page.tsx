"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_USER } from "apollo/queries/users";
import { Avatar, Button, TabsMenu, Typography } from "common/components";
import React, { useState } from "react";
import { ROUTES } from "common/constants/routes";
import { ArrowBackOutline } from "assets/icons";
import { TabItem } from "common/components/tabsMenu/tabsMenu";
import { Posts } from "../posts/posts";

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

  const [activeTab, setActiveTab] = useState("posts");

  const tabs: TabItem[] = [
    { value: "posts", title: "Posts", component: <Posts /> },
    { value: "payments", title: "Payments", component: <div>payments</div> },
    { value: "followers", title: "Followers", component: <div>followers</div> },
    { value: "following", title: "Following", component: <div>following</div> },
  ];
  return (
    <div>
      <Button asChild variant={"link"}>
        <a href="#" onClick={handleBackLinkClick}>
          <ArrowBackOutline width={24} height={24} />
          Back to Users List
        </a>
      </Button>
      <div>
        <Avatar size={"medium"} src={data?.getUser.profile.avatars[0]?.url} />
        <Typography variant={"h1"}>
          {data?.getUser.profile.firstName}&nbsp;{data?.getUser.profile.lastName}
        </Typography>
        <Typography variant={"regular_14"}>{data?.getUser.profile.userName}</Typography>
      </div>
      <div>
        <Typography>UserId</Typography>
        <Typography>{data?.getUser.id}</Typography>
        <Typography>Profile Creation Date</Typography>
        <Typography>{new Date(data?.getUser.profile.createdAt).toLocaleDateString("ru-RU")}</Typography>
      </div>
      <TabsMenu tabs={tabs} activeTabValue={activeTab} setActiveTabValue={setActiveTab} />
    </div>
  );
}
