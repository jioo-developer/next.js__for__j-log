module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
    "next/babel",
  ],
  plugins: ["@babel/plugin-transform-private-methods"],
};
