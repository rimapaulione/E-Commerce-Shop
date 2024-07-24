"use client";

import { useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/products";
import { useRouter } from "next/navigation";

type ActiveToggleDropdownItemProps = {
  id: string;
  isAvailableForPurchase: boolean;
};

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: ActiveToggleDropdownItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const clickHandler = function () {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailableForPurchase);
      router.refresh();
    });
  };

  return (
    <DropdownMenuItem onClick={clickHandler} disabled={isPending}>
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const clickHandler = function () {
    if (disabled) {
      return;
    }
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  };

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={clickHandler}
      disabled={disabled || isPending}
    >
      Delete
    </DropdownMenuItem>
  );
}
