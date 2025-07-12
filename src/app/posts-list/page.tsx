"use client";

import { TextField } from "common/components";
import s from "./page.module.css";
import { useSearch } from "common/hooks/useSearch";
import { NetworkStatus, useQuery, useSubscription } from "@apollo/client";
import { GET_POSTS } from "apollo/queries/users";
import { useCallback, useEffect, useRef, useState } from "react";
import { Posts } from "./posts/posts";
import { POST_ADDED } from "apollo/subscriptions/posts";
import { Post } from "graphql/generated";

export default function PostsList() {
  const { searchUser, handleSearch } = useSearch();

  const [vars, setVars] = useState({
    endCursorPostId: 0,
    pageSize: 10,
    sortBy: "createdAt",
    searchTerm: searchUser.searchTerm,
    sortDirection: "desc",
  });

  const { data, networkStatus, fetchMore } = useQuery(GET_POSTS, {
    variables: vars,
    notifyOnNetworkStatusChange: true,
  });

  useSubscription(POST_ADDED, {
    onData: ({ client, data }) => {
      const newPost = data.data?.postAdded;
      if (!newPost) return;

      client.cache.modify({
        fields: {
          getPosts(existing = { items: [], totalCount: 0 }) {
            const exists = existing.items.some((p: Post) => p.id === newPost.id);
            if (exists) return existing;

            return {
              ...existing,
              items: [newPost, ...existing.items],
              totalCount: existing.totalCount + 1,
            };
          },
        },
      });
    },
  });

  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const loadMore = useCallback(() => {
    if (!data?.getPosts.items.length) return;

    const lastId = data.getPosts.items[data.getPosts.items.length - 1].id;

    fetchMore({
      variables: { ...vars, endCursorPostId: lastId },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getPosts: {
            ...fetchMoreResult.getPosts,
            items: [...prev.getPosts.items, ...fetchMoreResult.getPosts.items],
          },
        };
      },
    });
  }, [data, fetchMore, vars]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const hasMore = data && data.getPosts.items.length < data.getPosts.totalCount;

        if (entry.isIntersecting && !isFetchingMore && hasMore) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [data, isFetchingMore, loadMore]);

  const onSearch = (value: string) => {
    handleSearch(value);
    setVars((vars) => ({
      ...vars,
      searchTerm: value,
      endCursorPostId: 0,
    }));
  };

  return (
    <div className={s.postsList}>
      <div className={s.textFieldWrapper}>
        <TextField
          type="search"
          variant="standard"
          placeholder="Search"
          value={searchUser.searchTerm}
          inputChangeHandler={onSearch}
        />
      </div>
      <Posts posts={data?.getPosts.items} />
      <div ref={sentinelRef} />
    </div>
  );
}
