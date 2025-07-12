"use client";

import s from "./posts.module.css";
import { FC, useState } from "react";
import { Typography } from "common/components";
import Image from "next/image";
import { PostImages } from "./postImages/postImages";
import { CreatedDate } from "./createdDate/createdDate";
import { Description } from "./description/description";
import { Post } from "graphql/generated";
import { Block } from "assets/icons";
import { BanUserModal } from "app/users-list/modalUsersList/banUserModal";

type Props = {
  posts?: Post[];
};

export const Posts: FC<Props> = ({ posts }) => {
  const [isImageCollapsed, setIsImageCollapsed] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState<{ type: string; userId: number } | null>(null);

  const handleOpenBanModal = (userId: number) => {
    setIsModalOpen({ type: "ban", userId });
  };

  const handleShowMore = (id: number, isExpanded: boolean) =>
    setIsImageCollapsed((prevState) => ({
      ...prevState,
      [id]: isExpanded,
    }));

  if (!posts || posts.length === 0)
    return (
      <Typography variant="h1" className={s.noPosts}>
        No posts
      </Typography>
    );

  const getItems = posts.map((item) => (
    <div key={item.id} className={s.mainWrapper}>
      <PostImages
        images={item.images || []}
        isCollapsed={isImageCollapsed[item.id] || false}
        ownerId={item.ownerId}
        postId={item.id}
      />
      <div className={s.userWithIcon}>
        <div className={s.profileName}>
          <div className={s.avatarOwner}>
            <Image
              src={item.postOwner.avatars?.[0]?.url || "/icons/svg/person.svg"}
              alt={item.postOwner.userName}
              width={36}
              height={36}
              priority
            />
          </div>
          <Typography variant={"h3"} color={"light"} textAlign={"left"}>
            {item.postOwner.userName}
          </Typography>
        </div>
        <Block width={24} height={24} className={s.icon} onClick={() => handleOpenBanModal(item.ownerId)} />
      </div>
      <CreatedDate createdAt={item.createdAt} />
      <Description
        description={item.description}
        onClickShowMore={(isExpanded) => handleShowMore(item.id, isExpanded)}
      />
      <BanUserModal
        isOpen={isModalOpen?.type === "ban" && isModalOpen.userId === item.ownerId}
        userId={item.ownerId}
        userName={item.postOwner.userName}
        onClose={() => setIsModalOpen(null)}
      />
    </div>
  ));

  return <div className={s.gridWrapper}>{getItems}</div>;
};
