import { Block, MoreHorizontal, PersonRemoveOutline } from "assets/icons";
import s from "./changeUserStatusDropdown.module.css";
import { DropdownItem, DropdownMenu, Typography } from "common/components";
import Link from "next/link";
import { ROUTES } from "common/constants/routes";

type Props = {
  onDeleteClick: (userId: number) => void;
  onBanClick: (userId: number) => void;
  userId: number;
};

export const ChangeUserStatusDropdown = ({ onDeleteClick, userId, onBanClick }: Props) => {
  return (
    <DropdownMenu className={s.dropdown}>
      <DropdownItem className={s.iconWithText} onClick={() => onDeleteClick(userId)}>
        <PersonRemoveOutline width={24} height={24} />
        <Typography variant="regular_14">Delete User</Typography>
      </DropdownItem>
      <DropdownItem className={s.iconWithText} onClick={() => onBanClick(userId)}>
        <Block width={24} height={24} />
        <Typography variant="regular_14">Ban in the system</Typography>
      </DropdownItem>
      <DropdownItem className={s.iconWithText}>
        <MoreHorizontal width={24} height={24} />
        <Link href={ROUTES.user(userId)} className={s.link}>
          <Typography variant="regular_14">More Information</Typography>
        </Link>
      </DropdownItem>
    </DropdownMenu>
  );
};
