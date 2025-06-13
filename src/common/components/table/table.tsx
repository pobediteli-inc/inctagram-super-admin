import { ComponentPropsWithoutRef, forwardRef } from "react";

import clsx from "clsx";

import s from "./table.module.css";

const Table = forwardRef<HTMLTableElement, ComponentPropsWithoutRef<"table">>(({ className, ...props }, ref) => (
  <table className={clsx(s.table, className)} ref={ref} {...props} />
));

const TableBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<"tbody">>(
  ({ className, ...props }, ref) => <tbody className={clsx(className)} ref={ref} {...props} />
);

const TableRow = forwardRef<HTMLTableRowElement, ComponentPropsWithoutRef<"tr">>(({ className, ...props }, ref) => (
  <tr className={clsx(s.tRow, className)} ref={ref} {...props} />
));

const TableHeadCell = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<"th">>(
  ({ className, id, ...props }, ref) => <th className={clsx(s.tHeadCell, className)} id={id} ref={ref} {...props} />
);

const TableCell = forwardRef<HTMLTableCellElement, ComponentPropsWithoutRef<"td">>(({ className, ...rest }, ref) => {
  return <td className={clsx(className, s.tCell)} {...rest} ref={ref} />;
});

export const TableHeader = ({ className, ...rest }: ComponentPropsWithoutRef<"thead">) => {
  return <thead className={clsx(className, s.tHeader)} {...rest} />;
};

export { Table, TableBody, TableCell, TableHeadCell, TableRow };
