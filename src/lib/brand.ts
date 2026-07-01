/** Dark-mode brand assets (light variants added when provided). */
export const brandAssets = {
  lockup: {
    dark: "/brand/azaquest-lockup-dark.png",
    light: "/brand/azaquest-lockup-dark.png",
  },
  icon: {
    dark: "/brand/azaquest-icon-dark.png",
    light: "/brand/azaquest-icon-dark.png",
  },
} as const;

export type LogoVariant = "lockup" | "icon";
