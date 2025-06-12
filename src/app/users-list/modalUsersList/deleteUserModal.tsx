import { BaseModal, Button, Typography } from "common/components";
import s from "./modalUsersList.module.css";
import { useMutation } from "@apollo/client";
import { REMOVE_USER } from "apollo/mutations/admin";

type Props = {
  onCloseAction: () => void;
  open: boolean;
  username: string;
  id: number;
};

export const DeleteUserModal = ({ open, onCloseAction, username, id }: Props) => {
  const [removeUser] = useMutation(REMOVE_USER);

  const onDeleteUser = async (id: number) => {
    try {
      await removeUser({ variables: { userId: id } });
      onCloseAction();
    } catch {
      return null;
    }
  };

  return (
    <BaseModal open={open} onClose={onCloseAction} modalTitle="Delete user" className={s.modalDeleteUser}>
      <div className={s.modalContainer}>
        <Typography variant={"regular_16"}>
          Are you sure to delete user <span className={s.span}>{username}</span>?
        </Typography>
        <div className={s.buttonWrapper}>
          <Button variant={"primary"} onClick={onCloseAction} className={s.button}>
            No
          </Button>
          <Button variant={"outlined"} onClick={() => onDeleteUser(id)} className={s.button}>
            Yes
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
