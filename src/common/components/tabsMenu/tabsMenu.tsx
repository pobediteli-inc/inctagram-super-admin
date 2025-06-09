"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Tab } from "./tab";
import s from "./tabsMenu.module.css";
import { useRef, useState, useLayoutEffect, ReactNode } from "react";
import { motion } from "framer-motion";

export type TabItem = {
  value: string;
  title: string;
  component: ReactNode;
};

type Props = {
  tabs: TabItem[];
  activeTabValue: string;
  setActiveTabValue: (value: string) => void;
};

export const TabsMenu = ({ tabs, activeTabValue, setActiveTabValue }: Props) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTabValue];
    if (el) {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setUnderlineStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  }, [activeTabValue]);

  return (
    <div className={s.container}>
      <Tabs.Root value={activeTabValue} onValueChange={setActiveTabValue} className={s.tabs}>
        <Tabs.List className={s.tabList}>
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              title={tab.title}
              ref={(el) => {
                tabRefs.current[`${tab.value}`] = el;
              }}
            />
          ))}

          <motion.div
            className={s.underline}
            animate={underlineStyle}
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          />
        </Tabs.List>
        {tabs.map((t) => (
          <Tabs.Content value={t.value} key={t.value}>
            {t.component}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
};
