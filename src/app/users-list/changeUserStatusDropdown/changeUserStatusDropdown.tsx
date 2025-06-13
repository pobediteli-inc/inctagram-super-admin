import { Block, MoreHorizontal } from "assets/icons";
import s from "./changeUserStatusDropdown.module.css";
import { Typography } from "common/components";
import { PersonRemoveOutline } from "assets/icons";
import Link from "next/link";
import { ROUTES } from "common/constants/routes";

type Props = {
  onDeleteClick: () => void;
  userId: number;
};

export const ChangeUserStatusDropdown = ({ onDeleteClick, userId }: Props) => {
  return (
    <div className={s.listWrapper}>
      <div className={s.iconWithText} onClick={onDeleteClick}>
        <PersonRemoveOutline width={24} height={24} />
        <Typography variant="regular_14">Delete User</Typography>
      </div>
      <div className={s.iconWithText}>
        <Block width={24} height={24} />
        <Typography variant="regular_14">Ban in the system</Typography>
      </div>
      <div className={s.iconWithText}>
        <MoreHorizontal width={24} height={24} />
              <Link href={ROUTES.user(userId)} className={s.link}>
                <Typography variant="regular_14">More Information</Typography>
              </Link>
      </div>
    </div>
  );
};
