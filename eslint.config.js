module.exports = [
    {
      files: ["src/**/*.js", "src/**/*.gs"], // Only apply to these files
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        globals: {
          GmailApp: "readonly",
          Logger: "readonly",
          SpreadsheetApp: "readonly",
          PropertiesService: "readonly",
          UrlFetchApp: "readonly",
        },
      },
      rules: {
        semi: ["error", "always"], // Enforce semicolons
        quotes: ["error", "double"], // Enforce double quotes
      },
      plugins: {
        googleappsscript: require("eslint-plugin-googleappsscript"), // GAS plugin
      },
    },
  ];
  