"use client";

import { useMutation } from "@apollo/client";
import { MutationUnbanUserArgs } from "graphql/generated";
import { UNBAN_USER } from "apollo/mutations/user";
import { ConfirmModal, Typography } from "common/components";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  refetch: () => void;
};

export const UnbanUserModal = ({ isOpen, userId, onClose, userName, refetch }: Props) => {
  const [unbanUser] = useMutation<{ unbanUser: boolean }, MutationUnbanUserArgs>(UNBAN_USER);

  const handleUnbanUser = async () => {
    try {
      await unbanUser({ variables: { userId } });
      refetch();
      onClose();
    } catch {
      return null;
    }
  };

  return (
    <ConfirmModal
      modalTitle="Un-ban user"
      isOpen={isOpen}
      handleClose={onClose}
      handleConfirm={handleUnbanUser}
    >
      <Typography variant="regular_16" asChild>
        <span>Are you sure you want to un-ban </span>
      </Typography>
      <Typography variant="bold_16" asChild>
        <span>{userName}?</span>
      </Typography>
    </ConfirmModal>
  );
};
