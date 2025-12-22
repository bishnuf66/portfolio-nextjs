module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript"
  ],
  plugins: ["react", "react-hooks", "jsx-a11y", "@typescript-eslint"],
  rules: {
    // Enforce Next.js Image component instead of img tag
    "@next/next/no-img-element": "error",
    
    // Enforce Next.js Link component instead of anchor tags for internal links
    "@next/next/no-html-link-for-pages": "error",
    
    // Custom rule to prevent <a> tags for internal navigation
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["hrefLeft", "hrefRight"],
      "aspects": ["invalidHref", "preferButton"]
    }],
    
    // Enforce proper quotes in JSX
    "jsx-quotes": ["error", "prefer-double"],
    
    // Enforce consistent quotes in JavaScript/TypeScript
    "quotes": ["error", "double", { 
      "avoidEscape": true,
      "allowTemplateLiterals": true 
    }],
    
    // Additional Next.js best practices
    "@next/next/no-page-custom-font": "error",
    "@next/next/no-unwanted-polyfillio": "error",
    "@next/next/no-before-interactive-script-outside-document": "error",
    "@next/next/no-css-tags": "error",
    "@next/next/no-head-element": "error",
    "@next/next/no-head-import-in-document": "error",
    "@next/next/no-script-component-in-head": "error",
    "@next/next/no-styled-jsx-in-document": "error",
    "@next/next/no-sync-scripts": "error",
    "@next/next/no-title-in-document-head": "error",
    
    // React best practices
    "react/jsx-no-target-blank": ["error", { 
      "allowReferrer": false,
      "enforceDynamicLinks": "always",
      "warnOnSpreadAttributes": true,
      "links": true,
      "forms": true
    }],
    
    // Accessibility rules
    "jsx-a11y/alt-text": ["error", {
      "elements": ["img", "object", "area", "input[type=\"image\"]"],
      "img": ["Image"],
      "object": ["Object"],
      "area": ["Area"],
      "input[type=\"image\"]": ["InputImage"
    }],
    
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    
    // Console rules (warnings in development, errors in production)
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    
    // Prevent common mistakes
    "no-undef": "error",
    "no-unused-expressions": "error",
    "no-unreachable": "error",
    "no-duplicate-imports": "error",
  },
  overrides: [
    {
      // Configuration files can use single quotes and console
      files: ["*.config.{js,ts,mjs}", "*.setup.{js,ts}"],
      rules: {
        "quotes": "off",
        "no-console": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
    "scripts/**",
    "supabase/**"
  ]
};