/* eslint-disable global-require, import/no-dynamic-require */
const buildConfig = env => {
  if (env === "dev" || env === "prod") {
    return require(`./webpack.config.${env}.js`);
  }
  throw new ReferenceError(
    "Wrong webpack build parameter. Possible choices: `dev` or `prod`."
  );
};

module.exports = buildConfig;
