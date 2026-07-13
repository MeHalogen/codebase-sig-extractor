import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Strip function/method bodies from JS/TS code, keeping signatures intact.
 */
export function extractSignatures(code: string): string {
  let result = "";
  let i = 0;

  while (i < code.length) {
    const char = code[i];

    // Handle comments
    if (char === "/" && code[i + 1] === "/") {
      // Single-line comment
      const endOfLine = code.indexOf("\n", i);
      const limit = endOfLine === -1 ? code.length : endOfLine;
      result += code.slice(i, limit);
      i = limit;
      continue;
    }

    if (char === "/" && code[i + 1] === "*") {
      // Multi-line comment
      const endOfComment = code.indexOf("*/", i);
      const limit = endOfComment === -1 ? code.length : endOfComment + 2;
      result += code.slice(i, limit);
      i = limit;
      continue;
    }

    // Handle string literals (so braces inside strings don't mess up counts)
    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      result += quote;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && i + 1 < code.length) {
          result += code[i] + code[i + 1];
          i += 2;
          continue;
        }
        if (code[i] === quote) {
          result += quote;
          i++;
          break;
        }
        result += code[i];
        i++;
      }
      continue;
    }

    // Detect function body start
    if (char === "{") {
      // Look back at the text we've accumulated to determine if this is a function/method body
      // We look back to verify if it is NOT a class, interface, enum, type, object assignment, or namespace.
      const lookbackLimit = Math.max(0, result.length - 120);
      const precedingText = result.slice(lookbackLimit).trim();

      // Check if the preceding text ends with ")" (optional return type) or "=>" or "constructor"
      const cleanedPreceding = precedingText.replace(/:\s*[^:{()=>]+$/, "").trim();
      
      const isFunctionSig =
        /\b(function|constructor|get|set)\b/.test(cleanedPreceding) ||
        /=>$/.test(cleanedPreceding) ||
        /\)$/.test(cleanedPreceding) ||
        // Anonymous/arrow parameters
        /\b[a-zA-Z0-9_$]+\s*=>$/.test(cleanedPreceding);

      if (isFunctionSig) {
        // Yes, it is a function body! Skip until we find the closing brace
        result += "{ }";
        i++; // skip '{'

        let braceCount = 1;
        while (i < code.length && braceCount > 0) {
          const nextChar = code[i];

          // Skip strings in function body
          if (nextChar === '"' || nextChar === "'" || nextChar === "`") {
            const innerQuote = nextChar;
            i++;
            while (i < code.length) {
              if (code[i] === "\\" && i + 1 < code.length) {
                i += 2;
                continue;
              }
              if (code[i] === innerQuote) {
                i++;
                break;
              }
              i++;
            }
            continue;
          }

          // Skip comments in function body
          if (nextChar === "/" && code[i + 1] === "/") {
            const endOfLine = code.indexOf("\n", i);
            i = endOfLine === -1 ? code.length : endOfLine;
            continue;
          }
          if (nextChar === "/" && code[i + 1] === "*") {
            const endOfComment = code.indexOf("*/", i);
            i = endOfComment === -1 ? code.length : endOfComment + 2;
            continue;
          }

          if (nextChar === "{") {
            braceCount++;
          } else if (nextChar === "}") {
            braceCount--;
          }
          i++;
        }
        continue;
      }
    }

    result += char;
    i++;
  }

  return result;
}

/**
 * Extract signatures from a file path
 */
export async function extractSignaturesFromFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf8");
  return extractSignatures(content);
}
