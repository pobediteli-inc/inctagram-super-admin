import { Block, MoreHorizontal } from "assets/icons";
import s from "./changeUserStatusDropdown.module.css";
import { Typography } from "common/components";
import { PersonRemoveOutline } from "assets/icons";

type Props = {
  onDeleteClick: () => void;
};

export const ChangeUserStatusDropdown = ({ onDeleteClick }: Props) => {
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
        <Typography variant="regular_14">More Information</Typography>
      </div>
    </div>
  );
};
