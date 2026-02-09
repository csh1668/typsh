"use client";

import { indentWithTab } from "@codemirror/commands";
import { EditorState, Prec } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap, type ViewUpdate } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { typst } from "codemirror-lang-typst";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { typstTheme } from "./typst-theme";

export interface CodeEditorHandle {
  setContent: (content: string) => void;
  getContent: () => string;
  focus: () => void;
}

interface CodeEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor({ initialContent = "", onChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    const initialContentRef = useRef(initialContent);

    // Keep callback ref up to date without recreating editor
    onChangeRef.current = onChange;
    initialContentRef.current = initialContent;

    useImperativeHandle(ref, () => ({
      setContent(content: string) {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: content,
          },
        });
      },
      getContent() {
        return viewRef.current?.state.doc.toString() ?? "";
      },
      focus() {
        viewRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const updateListener = EditorView.updateListener.of(
        (update: ViewUpdate) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        },
      );

      const state = EditorState.create({
        doc: initialContentRef.current,
        extensions: [
          basicSetup,
          oneDark,
          keymap.of([indentWithTab]),
          typst(),
          Prec.highest(typstTheme), // force highest priority for our custom colors
          updateListener,
          EditorView.lineWrapping,
        ],
      });

      const view = new EditorView({
        state,
        parent: containerRef.current,
      });

      view.focus();
      viewRef.current = view;

      return () => {
        view.destroy();
        viewRef.current = null;
      };
    }, []);

    return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
  },
);
