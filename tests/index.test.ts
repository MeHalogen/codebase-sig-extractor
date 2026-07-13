import { describe, it, expect } from "vitest";
import { extractSignatures } from "../src/index.js";

describe("extractSignatures", () => {
  it("should strip function bodies", () => {
    const input = `
      function hello(name: string): string {
        const greeting = "Hello " + name;
        console.log(greeting);
        return greeting;
      }
    `;
    const output = extractSignatures(input);
    expect(output).toContain("function hello(name: string): string { }");
    expect(output).not.toContain("const greeting");
  });

  it("should preserve interface and class declarations but strip methods", () => {
    const input = `
      interface User {
        name: string;
        age: number;
      }

      class UserService {
        private users: User[] = [];

        constructor() {
          console.log("initialized");
        }

        getUser(name: string): User | undefined {
          return this.users.find(u => u.name === name);
        }
      }
    `;
    const output = extractSignatures(input);
    expect(output).toContain("interface User {");
    expect(output).toContain("class UserService {");
    expect(output).toContain("constructor() { }");
    expect(output).toContain("getUser(name: string): User | undefined { }");
    expect(output).not.toContain("this.users.find");
  });

  it("should handle arrow functions", () => {
    const input = `
      const add = (a: number, b: number): number => {
        return a + b;
      };
    `;
    const output = extractSignatures(input);
    expect(output).toContain("const add = (a: number, b: number): number => { }");
    expect(output).not.toContain("return a + b;");
  });
});
