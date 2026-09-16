const fs = require("fs");
const path = require("path");

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(file)) continue;
      walk(filepath, filelist);
    } else if (/\.(ts|tsx)$/.test(file)) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const root = path.join(__dirname, "src");
const files = walk(root);

let changedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  // 1. params: Promise<{ id: string }> -> params: { id: string }
  content = content.replace(/Promise<\{\s*([^}]+?)\s*\}>/g, "{ $1 }");

  // 2. await params -> params
  content = content.replace(/await\s+params/g, "params");

  // 3. use(params) -> params
  content = content.replace(/use\(params\)/g, "params");

  // 4. Bersihin "use" dari import react kalau udah gak kepake
  content = content.replace(
    /import\s*\{([^}]*)\}\s*from\s*["']react["'];?/g,
    (match, importsStr) => {
      const items = importsStr.split(",").map((s) => s.trim()).filter(Boolean);
      const filtered = items.filter((item) => item !== "use");
      if (filtered.length === items.length) return match;
      if (filtered.length === 0) return "";
      return `import { ${filtered.join(", ")} } from "react";`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    changedCount++;
    console.log("Fixed:", path.relative(__dirname, file));
  }
}

console.log(`\nSelesai. ${changedCount} file diperbaiki.`);