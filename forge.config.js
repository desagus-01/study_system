const { AutoUnpackNativesPlugin } = require("@electron-forge/plugin-auto-unpack-natives");
const { VitePlugin } = require("@electron-forge/plugin-vite");

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  packagerConfig: {
    asar: true
  },
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main/main.ts",
          config: "vite.main.config.ts"
        },
        {
          entry: "src/preload/preload.ts",
          config: "vite.preload.config.ts"
        }
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts"
        }
      ]
    }),
    new AutoUnpackNativesPlugin()
  ]
};
