import { GET_POSTS_BY_USER } from "apollo/queries/users";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import s from "./uploadedPhotos.module.css";

type Props = {
  userId: number;
};

export const UploadedPhotos = ({ userId }: Props) => {
  const { data } = useQuery(GET_POSTS_BY_USER, {
    variables: { userId },
  });
  return (
    <div className={s.container}>
      {data?.getPostsByUser?.items.map((post) => {
        return (
          <Image src={post.url} alt={`image ${post.id}`} key={post.id} className={s.image} width={234} height={228} />
        );
      })}
    </div>
  );
};
