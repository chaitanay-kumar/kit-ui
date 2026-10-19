import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
function run(file, args) {
  const result = spawnSync(process.execPath, [path.join(root, file), ...args], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
for (const [source, target] of [
  ["LICENSE", "LICENSE"],
  ["licenses/UPSTREAM-MIT.txt", "UPSTREAM-MIT.txt"],
  ["licenses/LUCIDE.txt", "LUCIDE.txt"],
])
  fs.copyFileSync(
    path.join(root, source),
    path.join(root, "packages/angular", target),
  );
fs.writeFileSync(
  path.join(root, "packages/angular/styles.css"),
  fs.readFileSync(path.join(root, "src/lib/kit-controls.css"), "utf8") +
    "\n" +
    fs.readFileSync(path.join(root, "packages/angular/src/ports.css"), "utf8"),
);
run("node_modules/ng-packagr/src/cli/main.js", [
  "-p",
  "packages/angular/ng-package.json",
  "-c",
  "packages/angular/tsconfig.lib.json",
]);
run("node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js", [
  "-p",
  "packages/angular-demo/tsconfig.json",
]);
run("node_modules/vite/bin/vite.js", [
  "build",
  "--config",
  "packages/angular-demo/vite.config.ts",
]);
const downloads = path.join(root, "public/downloads");
fs.mkdirSync(downloads, { recursive: true });
const npmCli = process.env.npm_execpath;
if (!npmCli)
  throw new Error(
    "Run angular:build through npm so the npm executable is available.",
  );
const packed = spawnSync(
  process.execPath,
  [npmCli, "pack", "./packages/angular/dist", "--pack-destination", downloads],
  { cwd: root, stdio: "inherit" },
);
if (packed.status !== 0) process.exit(packed.status ?? 1);
const sources = path.join(root, "public/angular-source");
fs.mkdirSync(sources, { recursive: true });
const sourceRoot = path.join(root, "packages/angular/src");
function dependencies(file, visited = new Set()) {
  const result = {};
  for (const match of fs
    .readFileSync(file, "utf8")
    .matchAll(/from\s+['"](\.\/[^'"]+)['"]/g)) {
    const target = path.resolve(path.dirname(file), match[1] + ".ts");
    if (
      !target.startsWith(sourceRoot + path.sep) ||
      visited.has(target) ||
      !fs.existsSync(target)
    )
      continue;
    visited.add(target);
    result[path.relative(sourceRoot, target).replaceAll("\\", "/")] =
      fs.readFileSync(target, "utf8");
    Object.assign(result, dependencies(target, visited));
  }
  for(const match of fs.readFileSync(file,"utf8").matchAll(/styleUrls:\s*\[\s*['"](\.\/[^'"]+)['"]/g)){
    const target=path.resolve(path.dirname(file),match[1]);
    const includeStyle=style=>{
      if(!style.startsWith(sourceRoot+path.sep)||visited.has(style)||!fs.existsSync(style))return;
      visited.add(style);
      const content=fs.readFileSync(style,'utf8');
      result[path.relative(sourceRoot,style).replaceAll('\\','/')]=content;
      for(const imported of content.matchAll(/@import\s+['"](\.\/[^'"]+)['"]/g))includeStyle(path.resolve(path.dirname(style),imported[1]));
    };
    includeStyle(target);
  }
  return result;
}
for (const file of fs
  .readdirSync(path.join(root, "packages/angular/src"))
  .filter((file) => file.endsWith(".component.ts"))) {
  const id = file.replace(".component.ts", "");
  fs.writeFileSync(
    path.join(sources, `${id}.json`),
    JSON.stringify(
      {
        id,
        sourceCode: fs.readFileSync(
          path.join(root, "packages/angular/src", file),
          "utf8",
        ),
        types: fs.readFileSync(
          path.join(root, "packages/angular/src/types.ts"),
          "utf8",
        ),
        dependencies: dependencies(path.join(sourceRoot, file)),
        styles: fs.readFileSync(
          path.join(root, "packages/angular/styles.css"),
          "utf8",
        ),
      },
      null,
      2,
    ) + "\n",
  );
}
