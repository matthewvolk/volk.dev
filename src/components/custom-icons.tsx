import { ComponentPropsWithoutRef } from "react";

export const CustomIcons = {
  Npm: ({ ...props }: ComponentPropsWithoutRef<"svg">) => (
    <svg viewBox="0 0 780 250" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z" />
    </svg>
  ),
};