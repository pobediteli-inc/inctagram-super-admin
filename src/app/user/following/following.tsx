import { GET_FOLLOWING } from "apollo/queries/users";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { FollowPaginationModel } from "graphql/generated";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "common/components/table/table";
import { Pagination } from "common/components";
import Link from "next/link";
import { ROUTES } from "common/constants/routes";
import s from "./following.module.css";

type Props = { userId: number };

export const Following = ({ userId }: Props) => {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("size")) || 10;

  const { data } = useQuery<{ getFollowing: FollowPaginationModel }>(GET_FOLLOWING, {
    variables: {
      pageNumber: currentPage,
      pageSize,
      sortBy: "createdAt",
      sortDirection: "desc",
      userId,
    },
  });

  if (data?.getFollowing.items.length === 0) return <div>There&#39;s no following yet.</div>;

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
          {data?.getFollowing.items.map((following) => (
            <TableRow key={following.id}>
              <TableCell>{following.id}</TableCell>
              <TableCell>
                <Link href={ROUTES.user(following.userId)} className={s.link}>
                  {following.userName}
                </Link>
              </TableCell>
              <TableCell>
                {following.firstName} {following.lastName}
              </TableCell>
              <TableCell>{new Date(following.createdAt).toLocaleDateString("ru-RU")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data && <Pagination totalPages={data.getFollowing.pagesCount} className={s.pagination} />}
    </>
  );
};
