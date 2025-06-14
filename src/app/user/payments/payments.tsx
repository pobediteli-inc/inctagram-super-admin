import { GET_PAYMENTS_BY_USER } from "apollo/queries/users";
import { useQuery } from "@apollo/client";
import { CurrencyType, GetPaymentsByUserQuery, PaymentMethod } from "graphql/generated";
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "common/components/table/table";
import { getCurrencySymbol, getPaymentMethodDisplayName, getSubscriptionDuration } from "common/utils/helperFunctions";
import { Pagination } from "common/components";
import { useSearchParams } from "next/navigation";
import s from "./payments.module.css";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "common/constants/paginationConstants";

type Props = {
  userId: number;
};

export const Payments = ({ userId }: Props) => {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE;

  const { data } = useQuery<GetPaymentsByUserQuery>(GET_PAYMENTS_BY_USER, {
    variables: {
      pageNumber: currentPage,
      pageSize,
      sortBy: "createdAt",
      sortDirection: "desc",
      userId,
    },
  });

  if (data?.getPaymentsByUser.items.length === 0) return <div>There&#39;s no payments yet.</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Date of Payment</TableHeadCell>
            <TableHeadCell>End date of subscription</TableHeadCell>
            <TableHeadCell id={"amount"}>Amount, $</TableHeadCell>
            <TableHeadCell>Subscription Type</TableHeadCell>
            <TableHeadCell>Payment Type</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.getPaymentsByUser.items.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{new Date(payment.dateOfPayment).toLocaleDateString("ru-RU")}</TableCell>
              <TableCell>{new Date(payment.endDate).toLocaleDateString("ru-RU")}</TableCell>
              <TableCell id={"amount"}>
                {getCurrencySymbol(payment.payments[0].currency as CurrencyType)}
                {payment.price}
              </TableCell>
              <TableCell>{getSubscriptionDuration(payment.type)}</TableCell>
              <TableCell>{getPaymentMethodDisplayName(payment.paymentType as PaymentMethod)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data && <Pagination totalPages={data.getPaymentsByUser.pagesCount} className={s.pagination} />}
    </>
  );
};
