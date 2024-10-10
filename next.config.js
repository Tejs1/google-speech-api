/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.externals.push({
      "@google-cloud/text-to-speech": "commonjs @google-cloud/text-to-speech",
      "@google-cloud/speech": "commonjs @google-cloud/speech",
    });
    return config;
  },
};

export default config;
