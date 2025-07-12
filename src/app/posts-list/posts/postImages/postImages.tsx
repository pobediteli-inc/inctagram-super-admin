"use client";

import s from "./postImages.module.css";
import { FC, useState } from "react";
import Image from "next/image";
import ArrowIosBackOutline from "assets/icons/ArrowIosBackOutline";
import ArrowIosForwardOutline from "assets/icons/ArrowIosForwardOutline";
import clsx from "clsx";
import { ImagePost } from "graphql/generated";
import defaultImage from "public/icons/svg/image.svg";

export const PostImages: FC<Props> = ({ images, isCollapsed }) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [visibleButtonIndex, setVisibleButtonIndex] = useState<number>(0);

  const MAX_BUTTONS = 5;

  if (!images || images.length === 0)
    return <Image className={s.defaultImage} src={defaultImage} alt="Image" width={234} height={240} priority />;

  const updatePagination = (newButtonIndex: number) => {
    if (images.length <= MAX_BUTTONS) return;

    const currentButton = Math.floor(MAX_BUTTONS / 2 + 1);
    let newIndex = newButtonIndex - currentButton;

    if (newIndex < 0) newIndex = 0;
    if (newIndex + MAX_BUTTONS > images.length) newIndex = images.length - MAX_BUTTONS;

    setVisibleButtonIndex(newIndex);
  };
  const handlePreview = () =>
    setImageIndex((prevState) => {
      const index = prevState === 0 ? images?.length - 1 : prevState - 1;
      updatePagination(index);
      return index;
    });
  const handleNext = () =>
    setImageIndex((prevState) => {
      const index = prevState === images?.length - 1 ? 0 : prevState + 1;
      updatePagination(index);
      return index;
    });
  const handlePaginationButton = (currentIndex: number) => {
    setImageIndex(currentIndex);
    updatePagination(currentIndex);
  };

  const visibleButtons = images.slice(visibleButtonIndex, visibleButtonIndex + MAX_BUTTONS);

  return (
    <div className={clsx(s.mainWrapper, { [s.collapsed]: isCollapsed })}>
      <Image
        key={imageIndex}
        className={s.avatars}
        src={images[imageIndex].url || defaultImage}
        alt="Image"
        width={images[imageIndex].width || 234}
        height={images[imageIndex].height || 240}
        priority
      />
      {images && images?.length > 1 && (
        <>
          <ArrowIosBackOutline className={s.arrowLeft} onClick={handlePreview} width={24} height={24} />
          <ArrowIosForwardOutline className={s.arrowRight} onClick={handleNext} width={24} height={24} />
          <div className={s.pagination}>
            {visibleButtons.map((_, index) => (
              <div
                key={visibleButtonIndex + index}
                className={clsx(s.whiteDot, { [s.blueDot]: imageIndex === visibleButtonIndex + index })}
                onClick={() => handlePaginationButton(visibleButtonIndex + index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

type Props = {
  ownerId: number;
  postId: number;
  images?: ImagePost[];
  isCollapsed?: boolean;
};
