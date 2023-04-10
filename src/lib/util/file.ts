import path from "path";
import { promises as fs } from "fs";

export function readResource(...paths: string[]) {
  const resourcePath = path.join(process.cwd(), "resource", ...paths);
  return fs.readFile(resourcePath, "utf8");
}
