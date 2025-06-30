"use client";

import s from "./page.module.css";
import { Pagination, TextField } from "common/components";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "common/components/table/table";
import { useSearch } from "common/hooks/useSearch";
import { ArrowIosDownOutline, ArrowIosUp } from "assets/icons";
import { useQuery } from "@apollo/client";
import { GET_PAYMENTS } from "apollo/queries/users";
import { PaymentsPaginationModel, QueryGetPaymentsArgs } from "graphql/generated";
import { useSearchParams } from "next/navigation";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "common/constants/paginationConstants";

export default function PaymentsList() {
  const searchParams = useSearchParams();
  const { searchUser, handleSearch, handleSort } = useSearch();

  const pageNumber = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;

  const { data, loading } = useQuery<GetPaymentResponse, QueryGetPaymentsArgs>(GET_PAYMENTS, {
    variables: {
      pageSize,
      pageNumber,
      sortBy: searchUser.sortBy,
      sortDirection: searchUser.sortDirection,
      searchTerm: searchUser.searchTerm,
    },
  });

  const sortedItems = [...(data?.getPayments?.items ?? [])].sort((a, b) => {
    const search = searchUser.searchTerm.trim().toLowerCase();
    const aName = a.userName.toLowerCase();
    const bName = b.userName.toLowerCase();

    if (aName === search && bName !== search) return -1;
    if (aName !== search && bName === search) return 1;

    const aStarts = aName.startsWith(search);
    const bStarts = bName.startsWith(search);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return aName.localeCompare(bName);
  });

  return (
    <div className={s.paymentsList}>
      <div className={s.textFieldWrapper}>
        <TextField
          type="search"
          variant="standard"
          placeholder="Search"
          value={searchUser.searchTerm}
          inputChangeHandler={handleSearch}
        />
      </div>
      <Table className={s.table}>
        <TableHeader>
          <TableRow>
            <TableHeadCell className={s.tableHeadCell} onClick={() => handleSort("userName")}>
              Username {searchUser.sortBy === "userName" && (searchUser.sortDirection === "asc" ?
              <ArrowIosUp width={24} height={24} color={"var(--dark-100)"} /> :
              <ArrowIosDownOutline width={24} height={24} color={"var(--dark-100)"} />)}
            </TableHeadCell>
            <TableHeadCell className={s.tableHeadCell} onClick={() => handleSort("createdAt")}>
              Date added {searchUser.sortBy === "createdAt" && (searchUser.sortDirection === "asc" ?
              <ArrowIosUp width={24} height={24} color={"var(--dark-100)"} /> :
              <ArrowIosDownOutline width={24} height={24} color={"var(--dark-100)"} />)}
            </TableHeadCell>
            <TableHeadCell>Amount, $</TableHeadCell>
            <TableHeadCell>Subscription</TableHeadCell>
            <TableHeadCell>Payment Method</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} style={{ textAlign: "center" }}>Loading...</TableCell>
            </TableRow>
          ) : sortedItems.length ? (
            sortedItems.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>{payment.userName}</TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No result found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination totalPages={data?.getPayments?.pagesCount ?? 0} />
    </div>
  );
}

type GetPaymentResponse = {
  getPayments: PaymentsPaginationModel;
};
