import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const typstBrand = "oklch(0.7 0.14 215)";

const editorTheme = EditorView.theme(
  {
    "&": {
      color: "oklch(0.985 0 0)", // foreground
      backgroundColor: "oklch(0.12 0 0)", // background matches card/sidebar
      fontSize: "14px",
      height: "100%",
    },
    ".cm-content": {
      caretColor: typstBrand,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: "8px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: typstBrand,
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: "oklch(0.65 0.14 215 / 0.3)",
      },
    ".cm-panels": {
      backgroundColor: "oklch(0.15 0 0)",
      color: "oklch(0.9 0 0)",
    },
    ".cm-panels.cm-panels-top": {
      borderBottom: "1px solid oklch(1 0 0 / 12%)",
    },
    ".cm-panels.cm-panels-bottom": {
      borderTop: "1px solid oklch(1 0 0 / 12%)",
    },
    ".cm-searchMatch": {
      backgroundColor: "oklch(0.8 0.15 80 / 0.2)",
      outline: "1px solid oklch(0.8 0.15 80 / 0.4)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "oklch(0.8 0.15 80 / 0.4)",
    },
    ".cm-activeLine": {
      backgroundColor: "oklch(1 0 0 / 4%)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "oklch(0.65 0.14 215 / 0.15)",
    },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "oklch(1 0 0 / 15%)",
      outline: "1px solid oklch(1 0 0 / 30%)",
    },
    ".cm-gutters": {
      backgroundColor: "oklch(0.12 0 0)",
      color: "oklch(0.55 0 0)",
      border: "none",
      paddingRight: "8px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      color: "oklch(0.85 0 0)",
      fontWeight: "600",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "oklch(0.65 0.14 215)",
    },
    ".cm-tooltip": {
      border: "1px solid oklch(1 0 0 / 12%)",
      backgroundColor: "oklch(0.15 0 0)",
      color: "oklch(0.95 0 0)",
      borderRadius: "6px",
      boxShadow: "0 4px 12px oklch(0 0 0 / 0.4)",
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: "oklch(0.15 0 0)",
      borderBottomColor: "oklch(0.15 0 0)",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "oklch(0.65 0.14 215 / 0.2)",
        color: "oklch(0.98 0 0)",
      },
    },
    // Scrollbar styling
    ".cm-scroller": {
      overflow: "auto",
    },
  },
  { dark: true },
);

const highlightStyle = HighlightStyle.define(
  [
    { tag: tags.keyword, color: "oklch(0.8 0.16 310)" }, // purple
    { tag: tags.operator, color: "oklch(0.85 0.12 70)" }, // warm/gold
    { tag: tags.special(tags.variableName), color: "oklch(0.8 0.16 40)" }, // orange/red
    { tag: tags.typeName, color: "oklch(0.82 0.12 210)" }, // cyan
    { tag: tags.atom, color: "oklch(0.8 0.16 40)" },
    { tag: tags.number, color: "oklch(0.85 0.12 90)" }, // lime/yellow
    { tag: tags.definition(tags.variableName), color: "oklch(0.85 0.12 210)" },
    { tag: tags.string, color: "oklch(0.82 0.15 160)" }, // green
    { tag: tags.special(tags.string), color: "oklch(0.82 0.15 160)" },
    { tag: tags.comment, color: "oklch(0.6 0 0)", fontStyle: "italic" },
    { tag: tags.variableName, color: "oklch(0.9 0.05 220)" },
    { tag: tags.tagName, color: typstBrand },
    { tag: tags.bracket, color: "oklch(0.8 0 0)" },
    { tag: tags.meta, color: "oklch(0.75 0.1 70)" },
    { tag: tags.link, color: typstBrand, textDecoration: "underline" },
    { tag: tags.heading, color: "oklch(0.8 0.12 215)", fontWeight: "bold" },
    { tag: tags.heading1, color: "oklch(0.8 0.12 215)", fontWeight: "bold" },
    { tag: tags.heading2, color: "oklch(0.8 0.12 215)", fontWeight: "bold" },
    { tag: tags.heading3, color: "oklch(0.8 0.12 215)", fontWeight: "bold" },
    { tag: tags.emphasis, fontStyle: "italic" },
    { tag: tags.strong, fontWeight: "bold" },
    { tag: tags.strikethrough, textDecoration: "line-through" },
    { tag: tags.invalid, color: "oklch(0.7 0.2 25)" }, // red
    {
      tag: tags.function(tags.variableName),
      color: typstBrand,
    },
    { tag: tags.labelName, color: "oklch(0.85 0.12 90)" },
    { tag: tags.processingInstruction, color: "oklch(0.8 0.16 310)" },
    { tag: tags.punctuation, color: "oklch(0.8 0 0)" },
    { tag: tags.content, color: "oklch(0.985 0 0)" },
    { tag: tags.separator, color: "oklch(0.8 0 0)" },
  ],
  { all: { color: "oklch(0.985 0 0)" } },
);

export const typstTheme = [editorTheme, syntaxHighlighting(highlightStyle)];
