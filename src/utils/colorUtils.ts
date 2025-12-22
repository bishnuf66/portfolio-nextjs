/**
 * Utility functions for consistent color scheme across the application
 */

export const colorScheme = {
  // Background colors
  background: {
    primary: "bg-light-primary dark:bg-dark-primary",
    secondary: "bg-light-secondary dark:bg-dark-secondary",
    tertiary: "bg-light-tertiary dark:bg-dark-tertiary",
  },

  // Text colors
  text: {
    primary: "text-light-text dark:text-dark-text",
    secondary: "text-light-text-secondary dark:text-dark-text-secondary",
    muted: "text-light-text-muted dark:text-dark-text-muted",
  },

  // Border colors
  border: {
    primary: "border-light-border dark:border-dark-border",
  },

  // Combined classes for common patterns
  card:
    "bg-light-primary dark:bg-dark-secondary border-light-border dark:border-dark-border",
  input:
    "bg-light-primary dark:bg-dark-tertiary border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted cursor-text",
  page:
    "bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text",
  section: "bg-light-secondary dark:bg-dark-secondary",
  modal:
    "bg-light-primary dark:bg-dark-secondary border-light-border dark:border-dark-border",
};

/**
 * Get consistent background class based on theme
 */
export const getBackgroundClass = (
  variant: "primary" | "secondary" | "tertiary" = "primary",
) => {
  return colorScheme.background[variant];
};

/**
 * Get consistent text class based on theme
 */
export const getTextClass = (
  variant: "primary" | "secondary" | "muted" = "primary",
) => {
  return colorScheme.text[variant];
};

/**
 * Get page-level classes for consistent layout
 */
export const getPageClasses = () => {
  return `min-h-screen pt-20 ${colorScheme.page}`;
};

/**
 * Get card classes for consistent styling
 */
export const getCardClasses = (additionalClasses = "") => {
  return `${colorScheme.card} ${additionalClasses}`;
};

/**
 * Get input classes for consistent form styling
 */
export const getInputClasses = (additionalClasses = "") => {
  return `${colorScheme.input} ${additionalClasses}`;
};
