"use client";

import s from "./sidebar.module.css";
import {
  Person,
  ImageOutline, Statistics, Payments,
} from "assets/icons";
import { SidebarItem, SidebarLink } from "./sidebarLink/sidebarLink";

const sidebarItems: SidebarItem[] = [
  {
    href: "/users-list",
    icon: <Person width={24} height={24} />,
    title: "Users list",
  },
  {
    href: "/statistics",
    icon: <Statistics width={24} height={24} />,
    title: "Statistics",
  },
  {
    href: "/payments-list",
    icon: <Payments width={24} height={24} />,
    title: "Payments list",
  },
  {
    href: "/posts-list",
    icon: <ImageOutline width={24} height={24} />,
    title: "Posts list",
  },
];

export const Sidebar = () => {

  return (
    <nav className={s.navbar}>
      {sidebarItems.map((i, index) => (
        <SidebarLink item={i} key={index} />
      ))}
    </nav>
  );
};
