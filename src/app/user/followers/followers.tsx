import { GET_FOLLOWERS } from "apollo/queries/users";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { FollowPaginationModel } from "graphql/generated";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "common/components/table/table";
import { Pagination } from "common/components";
import s from "./followers.module.css";
import Link from "next/link";
import { ROUTES } from "common/constants/routes";

type Props = { userId: number };

export const Followers = ({ userId }: Props) => {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("size")) || 10;

  const { data } = useQuery<{ getFollowers: FollowPaginationModel }>(GET_FOLLOWERS, {
    variables: {
      pageNumber: currentPage,
      pageSize,
      sortBy: "createdAt",
      sortDirection: "desc",
      userId,
    },
  });

  if (data?.getFollowers.items.length === 0) return <div>There&#39;s no followers yet.</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>User ID</TableHeadCell>
            <TableHeadCell>Profile link</TableHeadCell>
            <TableHeadCell>Username</TableHeadCell>
            <TableHeadCell>Subscription Date</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.getFollowers.items.map((follower) => (
            <TableRow key={follower.id}>
              <TableCell>{follower.id}</TableCell>
              <TableCell>
                <Link href={ROUTES.user(follower.userId)} className={s.link}>
                  {follower.userName}
                </Link>
              </TableCell>
              <TableCell>
                {follower.firstName} {follower.lastName}
              </TableCell>
              <TableCell>{new Date(follower.createdAt).toLocaleDateString("ru-RU")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data && <Pagination totalPages={data.getFollowers.pagesCount} className={s.pagination} />}
    </>
  );
};
