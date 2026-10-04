import type { CodeLanguage } from "@/types/blog";

export interface Token {
  readonly value: string;
  readonly kind: TokenKind;
}

export type TokenKind =
  | "plain"
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "type"
  | "punct"
  | "property"
  | "tag";

interface Rule {
  readonly kind: TokenKind;
  readonly pattern: RegExp;
}

const KEYWORDS =
  "const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|class|extends|implements|import|from|export|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|as|interface|type|enum|readonly|public|private|protected|static|satisfies|yield|delete|void|do|declare|namespace|infer|keyof";

const TYPES =
  "string|number|boolean|null|undefined|any|unknown|never|object|symbol|bigint|true|false|this|super|Promise|Array|Record|Partial|Readonly|Map|Set";

/**
 * Deliberately lightweight, dependency-free highlighter.
 * Rules are evaluated in order; the earliest/longest match wins.
 */
const RULES: Record<CodeLanguage, readonly Rule[]> = {
  ts: baseJsRules(),
  js: baseJsRules(),
  tsx: [
    { kind: "comment", pattern: /\/\/.*|\/\*[\s\S]*?\*\// },
    {
      kind: "string",
      pattern: /`(?:\\[\s\S]|[^\\`])*`|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/,
    },
    { kind: "tag", pattern: /<\/?[A-Z][\w.]*|<\/?[a-z][\w-]*(?=[\s/>])/ },
    { kind: "keyword", pattern: new RegExp(`\\b(?:${KEYWORDS})\\b`) },
    { kind: "type", pattern: new RegExp(`\\b(?:${TYPES})\\b`) },
    { kind: "function", pattern: /\b[A-Za-z_$][\w$]*(?=\s*\()/ },
    { kind: "property", pattern: /\b[A-Za-z_$][\w$]*(?=\s*:)/ },
    { kind: "number", pattern: /\b0x[\da-f]+\b|\b\d+(?:\.\d+)?\b/i },
    { kind: "punct", pattern: /[{}[\]()<>;,.=+\-*/%!?&|:]+/ },
  ],
  json: [
    { kind: "property", pattern: /"(?:\\.|[^\\"])*"(?=\s*:)/ },
    { kind: "string", pattern: /"(?:\\.|[^\\"])*"/ },
    { kind: "type", pattern: /\b(?:true|false|null)\b/ },
    { kind: "number", pattern: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i },
    { kind: "punct", pattern: /[{}[\],:]/ },
  ],
  bash: [
    { kind: "comment", pattern: /#.*/ },
    { kind: "string", pattern: /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/ },
    {
      kind: "keyword",
      pattern:
        /\b(?:npm|pnpm|bun|yarn|npx|git|cd|mkdir|export|echo|curl|docker|node|sudo|rm|cp|mv)\b/,
    },
    { kind: "property", pattern: /(?:^|\s)--?[\w-]+/ },
    { kind: "number", pattern: /\b\d+(?:\.\d+)*\b/ },
    { kind: "punct", pattern: /[|&><$();]/ },
  ],
  css: [
    { kind: "comment", pattern: /\/\*[\s\S]*?\*\// },
    { kind: "keyword", pattern: /@[\w-]+/ },
    { kind: "string", pattern: /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/ },
    { kind: "property", pattern: /[\w-]+(?=\s*:)/ },
    {
      kind: "number",
      pattern: /#[\da-f]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|vh|vw)?\b/i,
    },
    { kind: "punct", pattern: /[{}:;,()]/ },
  ],
  text: [],
};

function baseJsRules(): readonly Rule[] {
  return [
    { kind: "comment", pattern: /\/\/.*|\/\*[\s\S]*?\*\// },
    {
      kind: "string",
      pattern: /`(?:\\[\s\S]|[^\\`])*`|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/,
    },
    { kind: "keyword", pattern: new RegExp(`\\b(?:${KEYWORDS})\\b`) },
    { kind: "type", pattern: new RegExp(`\\b(?:${TYPES})\\b`) },
    { kind: "function", pattern: /\b[A-Za-z_$][\w$]*(?=\s*\()/ },
    { kind: "property", pattern: /\b[A-Za-z_$][\w$]*(?=\s*:)/ },
    { kind: "number", pattern: /\b0x[\da-f]+\b|\b\d+(?:\.\d+)?\b/i },
    { kind: "punct", pattern: /[{}[\]()<>;,.=+\-*/%!?&|:]+/ },
  ];
}

/**
 * Tokenizes a single source string. Runs in O(n · rules) and is memoized by
 * callers (see `CodeBlock`), so it is cheap enough for client rendering.
 */
export function highlight(code: string, language: CodeLanguage): Token[] {
  const rules = RULES[language] ?? [];
  if (rules.length === 0) return [{ value: code, kind: "plain" }];

  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < code.length) {
    let best: { index: number; length: number; kind: TokenKind } | null = null;

    for (const rule of rules) {
      const re = new RegExp(
        rule.pattern.source,
        rule.pattern.flags.includes("g")
          ? rule.pattern.flags
          : `${rule.pattern.flags}g`,
      );
      re.lastIndex = cursor;
      const match = re.exec(code);
      if (!match) continue;
      const index = match.index;
      const length = match[0].length;
      if (length === 0) continue;
      if (
        !best ||
        index < best.index ||
        (index === best.index && length > best.length)
      ) {
        best = { index, length, kind: rule.kind };
      }
    }

    if (!best) {
      tokens.push({ value: code.slice(cursor), kind: "plain" });
      break;
    }

    if (best.index > cursor)
      tokens.push({ value: code.slice(cursor, best.index), kind: "plain" });
    tokens.push({
      value: code.slice(best.index, best.index + best.length),
      kind: best.kind,
    });
    cursor = best.index + best.length;
  }

  return tokens;
}

export const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: "text-slate-300",
  keyword: "tok-keyword",
  string: "tok-string",
  comment: "tok-comment",
  number: "tok-number",
  function: "tok-function",
  type: "tok-type",
  punct: "tok-punct",
  property: "tok-property",
  tag: "tok-tag",
};
