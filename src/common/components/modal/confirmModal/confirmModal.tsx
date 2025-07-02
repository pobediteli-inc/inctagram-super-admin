import { BaseModal, Button } from "common/components";
import s from "./confirmModal.module.css";
import { ComponentPropsWithoutRef } from "react";
import { clsx } from "clsx";

type Props = {
  modalTitle: string;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
} & ComponentPropsWithoutRef<"div">;

export const ConfirmModal = ({ modalTitle, isOpen, handleClose, handleConfirm, children, className }: Props) => {
  return (
    <BaseModal open={isOpen} onClose={handleClose} modalTitle={modalTitle} className={clsx(className, s.modal)}>
      <div className={s.content}>
        {children}
        <div className={s.buttonsContainer}>
          <Button variant={"outlined"} className={s.button} onClick={handleConfirm}>
            Yes
          </Button>
          <Button className={s.button} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
