#!/usr/bin/env node

import { extractSignaturesFromFile } from "./index.js";
import { writeFile } from "node:fs/promises";

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help") || args.length === 0) {
    console.log(`
Usage: codebase-sig-extractor <file-path> [options]

Options:
  -o, --output <file>   Save output to a specific file
  -h, --help            Show help info
`);
    process.exit(0);
  }

  const filePath = args[0];
  let outputFile: string | undefined = undefined;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-o" || arg === "--output") {
      outputFile = args[++i];
    }
  }

  try {
    const result = await extractSignaturesFromFile(filePath);
    if (outputFile) {
      await writeFile(outputFile, result, "utf8");
      console.log(`Signatures saved to ${outputFile}`);
    } else {
      process.stdout.write(result + "\n");
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
