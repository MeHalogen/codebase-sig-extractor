# codebase-sig-extractor

> **TS/JS Signature Skeletonizer:** Extract class, interface, type, and function signatures while stripping implementation details to fit your codebase into LLM prompt contexts.

A zero-dependency TypeScript parser that removes function and method bodies, reducing token size by 80% while retaining full structural context for AI agents.

---

## ⚡ Features
- **Zero Runtime Dependencies**: Fast and lightweight character scanning.
- **TypeScript & JavaScript Support**: Handles types, interfaces, arrow functions, classes, and method modifiers.
- **Comment and String Literals Safety**: Ignores comments and nested braces inside strings.

---

## 📦 Installation

```bash
npm install codebase-sig-extractor
```

---

## 🚀 Usage

### 1. CLI Usage
Print signature skeleton of a file to stdout:

```bash
npx codebase-sig-extractor src/index.ts

# Save to output file
npx codebase-sig-extractor src/index.ts -o dist/index.d.ts.mock
```

### 2. Programmatic API

```javascript
import { extractSignatures } from 'codebase-sig-extractor';

const code = `
  export function greet(name: string): string {
    const message = \`Hello, \${name}!\`;
    return message;
  }
`;

const signatures = extractSignatures(code);
console.log(signatures);
// Output: export function greet(name: string): string { }
```

---

## 📄 License
MIT License.
