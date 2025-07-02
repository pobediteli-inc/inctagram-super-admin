"use client";

import { FC, useEffect } from "react";
import s from "./header.module.css";
import { Select } from "common/components/select/select";
import { Typography } from "common/components/typography/typography";
import { FlagRussia, FlagUnitedKingdom } from "assets/icons";
import { SelectItemsProps } from "common/types/SelectItemsProps/SelectItemsProps";
import { LogOut } from "common/components/logOut/logOut";
import { useAppSelector } from "common/hooks/useAppSelector";
import { selectIsLoggedIn, setLoggedIn, setStatus } from "store/services/slices";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { handleErrors } from "common/utils/handleErrors";
import { useRouter } from "next/navigation";
import { client, isLoggedInVar, updateLoginState } from "apollo/client";
import { useReactiveVar } from "@apollo/client";

export const Header: FC = () => {
  const authStatus = useReactiveVar(isLoggedInVar);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectLanguages: SelectItemsProps[] = [
    { value: "en", label: "English", icon: <FlagUnitedKingdom width={20} height={20} /> },
    { value: "ru", label: "Russian", icon: <FlagRussia width={20} height={20} /> },
  ];

  const handleLogOut = async () => {
    dispatch(setLoggedIn({ isLoggedIn: false }));
    updateLoginState(false);
  };
  const handleOnMainPage = () => router.push("/");

  useEffect(() => {
    try {
      if (authStatus) {
        dispatch(setLoggedIn({ isLoggedIn: true }));
        dispatch(setStatus({ status: null, message: null }));
      }
    } catch (error: unknown) {
      handleErrors(error, dispatch);
      dispatch(setLoggedIn({ isLoggedIn: false }));
      client.clearStore();
    }
  }, [authStatus, dispatch]);

  return (
    <header className={s.headerWrapper}>
      <div className={s.mainWrapper}>
        <div className={s.logo}>
          <Typography
            style={{ cursor: "pointer" }}
            variant={"large"}
            color={"light"}
            textAlign={"center"}
            onClick={handleOnMainPage}
          >Inctagram</Typography>
          <Typography variant={"small"}>Super</Typography>
          <Typography variant={"bold_small"}>Admin</Typography>
        </div>
        <div className={s.selectButtonsWrapper}>
          <Select defaultValue={"en"} items={selectLanguages} groupLabel={"Languages"} />
          <div className={s.buttonsWrapper}>
            {isLoggedIn ?
              <LogOut onLogOutAction={handleLogOut} email={"admin@gmail.com"} /> : <></>
            }
          </div>
        </div>
      </div>
    </header>
  );
};
