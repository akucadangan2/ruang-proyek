const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "postcss.config.js");

const content = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

fs.writeFileSync(filePath, content, "utf8");
console.log("Ditulis:", filePath);