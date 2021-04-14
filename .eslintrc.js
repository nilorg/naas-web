module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
    OAUTH2_CLIENT_ID: true,
    OAUTH2_SERVER: true,
    OAUTH2_CALLBACK: true,
  },
};
