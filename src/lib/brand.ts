/** Brand assets per theme (lockup = icon + wordmark). */
export const brandAssets = {
  lockup: {
    dark: "/brand/azaquest-lockup-dark.png",
    light: "/brand/azaquest-lockup-light.png",
  },
  icon: {
    dark: "/brand/azaquest-icon-dark.png",
    light: "/brand/azaquest-icon-dark.png",
  },
} as const;

export type LogoVariant = "lockup" | "icon";
