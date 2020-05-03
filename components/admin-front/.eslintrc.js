module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
        "plugin:@typescript-eslint/recommended" // Uses the recommended rules from @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    rules: {
        quotes: ["error", "single"],
        semi: ["error", "never"],
        'object-curly-spacing': ["error", "always"],
        "indent": ["error", 2],
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/semi": ["error", "never"],
        '@typescript-eslint/member-delimiter-style': ["error", { multiline: { delimiter: 'none' } }]
    },
    settings: {
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    }
};
