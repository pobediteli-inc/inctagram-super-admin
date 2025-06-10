import { Block, MoreHorizontal, MoreHorizontalOutline } from "assets/icons";
import { useEffect, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={s.wrapper} ref={dropdownRef}>
      <div
        className={s.icon}
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Toggle dropdown"
      >
        <MoreHorizontalOutline width={24} height={24} />
      </div>
      {isOpen && (
        <div className={s.dropdown} role="menu">
          <div className={s.listWrapper}>
            <div className={s.iconWithText} onClick={() => handleOptionClick(onDeleteClick)}>
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
        </div>
      )}
    </div>
  );
};
