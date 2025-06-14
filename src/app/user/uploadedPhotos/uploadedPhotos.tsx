import { GET_POSTS_BY_USER } from "apollo/queries/users";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import s from "./uploadedPhotos.module.css";
import { Fragment, useEffect, useState } from "react";
import { Typography } from "common/components";
import { GetPostsByUserQuery, ImagePost } from "graphql/generated";

type Props = {
  userId: number;
};

export const UploadedPhotos = ({ userId }: Props) => {
  const [posts, setPosts] = useState<ImagePost[]>([]);
  const [endCursorId, setEndCursorId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore } = useQuery<GetPostsByUserQuery>(GET_POSTS_BY_USER, {
    variables: { userId, endCursorId: null },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.getPostsByUser?.items) {
      const initialPosts = data.getPostsByUser.items;

      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const uniqueNewItems = initialPosts.filter((post) => !existingIds.has(post.id));
        return [...prev, ...uniqueNewItems];
      });

      const lastPostId = initialPosts.length ? initialPosts[initialPosts.length - 1].id : null;

      setEndCursorId(lastPostId ?? null);

      setHasMore(initialPosts.length > 0);
    }
  }, [data]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      fetchMore({
        variables: { userId, endCursorId },
      }).then((fetchMoreResult) => {
        const newItems = fetchMoreResult.data.getPostsByUser.items;

        setPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post.id));
          const uniqueNewItems = (newItems ?? []).filter((post) => !existingIds.has(post.id));
          return [...prev, ...uniqueNewItems];
        });

        setEndCursorId(newItems?.length ? (newItems[newItems.length - 1]?.id ?? null) : null);
        setHasMore((newItems ?? []).length > 0);
      });
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 &&
      hasMore &&
      !loading
    ) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [endCursorId, hasMore, loading]);

  return (
    <div className={s.container}>
      {!loading && posts.length === 0 && <Typography variant={"regular_16"}>There&#39;s no photos yet.</Typography>}
      {posts.map((post) => (
        <Fragment key={post.id}>
          {post.url && <Image src={post.url} alt={`image ${post.id}`} className={s.image} width={234} height={228} />}
        </Fragment>
      ))}
      {loading && <p>Loading...</p>} {/* Show loader */}
    </div>
  );
};
