import { ApolloQueryResult, useMutation } from "@apollo/client";
import { GetUsersQuery, MutationBanUserArgs } from "graphql/generated";
import { BAN_USER } from "apollo/mutations/user";
import { ConfirmModal, Select, Textarea, Typography } from "common/components";
import { SelectItemsProps } from "common/types";
import { useEffect, useState } from "react";
import s from "./modalUsersList.module.css";
import { BAN_REASONS } from "common/constants/userMutationConstants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  refetch?: () => Promise<ApolloQueryResult<GetUsersQuery>>;
};

export const BanUserModal = ({ isOpen, userId, onClose, userName, refetch }: Props) => {
  const [banUser] = useMutation<{ banUser: boolean }, MutationBanUserArgs>(BAN_USER);

  const { badBehavior, adPlacement, another } = BAN_REASONS;

  const handleBanUser = async (userId: number, banReason: string) => {
    await banUser({ variables: { userId, banReason } });
    if (refetch) {
      await refetch();
    }
    onClose();
  };

  const [selectValue, setSelectValue] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    if (selectValue === badBehavior) {
      setReason(badBehavior);
    } else if (selectValue === adPlacement) {
      setReason(adPlacement);
    }
  }, [selectValue, adPlacement, badBehavior]);

  const selectItems: SelectItemsProps[] = [
    { value: badBehavior, label: badBehavior },
    { value: adPlacement, label: adPlacement },
    { value: another, label: another },
  ];

  return (
    <ConfirmModal
      modalTitle={"Ban user"}
      isOpen={isOpen}
      handleClose={onClose}
      handleConfirm={() => handleBanUser(userId, reason)}
    >
      <Typography variant="regular_16" asChild>
        <span>Are you sure you want to ban this user, </span>
      </Typography>
      <Typography variant="bold_16" asChild>
        <span>{userName}?</span>
      </Typography>
      <Select
        items={selectItems}
        placeholder={"Reason for ban"}
        value={selectValue}
        onValueChange={setSelectValue}
        className={s.select}
      />
      {selectValue === another && (
        <Textarea title={"Please describe the reason"} onChange={(e) => setReason(e.target.value)} />
      )}
    </ConfirmModal>
  );
};
