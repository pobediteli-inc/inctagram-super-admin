import { ComponentPropsWithoutRef, ComponentRef, forwardRef, ReactNode } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import * as RadixSelect from "@radix-ui/react-select";
import stl from "common/components/select/selectItems/selectItems.module.css";
import { clsx } from "clsx";
import { Typography } from "common/components/typography/typography";

type Props = {
  className?: string;
  value: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<typeof RadixSelect.Item>;

export const SelectItem = forwardRef<ComponentRef<typeof RadixSelect.Item>, Props>(
  ({ value, children, disabled, className, ...rest }, ref) => {
    return (
      <RadixSelect.Item
        className={clsx(stl.itemWrapper, className)}
        value={value}
        disabled={disabled}
        ref={ref}
        data-hide-when-selected
        {...rest}
      >
        <Typography variant={"regular_16"} color={"light"}>
          <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        </Typography>
        <RadixSelect.ItemIndicator className={stl.ItemIndicator}>
          <CheckIcon />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";
