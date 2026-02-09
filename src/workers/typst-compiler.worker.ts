import {
  createTypstCompiler,
  type TypstCompiler,
} from "@myriaddreamin/typst.ts";
import { loadFonts } from "@myriaddreamin/typst.ts/dist/esm/options.init.mjs";

export type WorkerRequest =
  | { type: "init" }
  | {
      type: "compile";
      files: Record<string, string>;
      mainFilePath: string;
    };

export type WorkerResponse =
  | { type: "init-done" }
  | { type: "init-error"; error: string }
  | { type: "compile-done"; pdf: ArrayBuffer }
  | {
      type: "compile-error";
      error: string;
      diagnostics?: string[];
    };

let compiler: TypstCompiler | null = null;
let compiling = false;
let pendingRequest: Extract<WorkerRequest, { type: "compile" }> | null = null;

async function initCompiler() {
  try {
    compiler = createTypstCompiler();

    const fontUrls = [
      "https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.12/files/roboto-latin-400-normal.woff2",
      "https://cdn.jsdelivr.net/npm/@fontsource/source-code-pro@5.0.12/files/source-code-pro-latin-400-normal.woff2",
      // Full Korean glyph coverage via SubsetOTF (~4.4MB each)
      "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/SubsetOTF/KR/NotoSansKR-Regular.otf",
      "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Serif/SubsetOTF/KR/NotoSerifKR-Regular.otf",
    ];

    await compiler.init({
      getModule: () =>
        fetch(`${self.location.origin}/typst_ts_web_compiler_bg.wasm`).then(
          (res) => res.arrayBuffer(),
        ),
      beforeBuild: [loadFonts(fontUrls)],
    });

    self.postMessage({ type: "init-done" } satisfies WorkerResponse);
  } catch (err) {
    self.postMessage({
      type: "init-error",
      error: err instanceof Error ? err.message : String(err),
    } satisfies WorkerResponse);
  }
}

async function doCompile(files: Record<string, string>, mainFilePath: string) {
  if (!compiler) {
    self.postMessage({
      type: "compile-error",
      error: "Compiler not initialized",
    } satisfies WorkerResponse);
    return;
  }

  compiling = true;

  try {
    compiler.resetShadow();
    for (const [path, content] of Object.entries(files)) {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      compiler.addSource(normalizedPath, content);
    }

    const normalizedMainPath = mainFilePath.startsWith("/")
      ? mainFilePath
      : `/${mainFilePath}`;

    const result = await compiler.compile({
      mainFilePath: normalizedMainPath,
      format: 1, // CompileFormatEnum.pdf
      diagnostics: "unix",
    });

    if (result.result) {
      const data = result.result as Uint8Array;
      const buffer = data.slice().buffer;

      self.postMessage(
        { type: "compile-done", pdf: buffer } satisfies WorkerResponse,
        { transfer: [buffer] },
      );
    } else {
      self.postMessage({
        type: "compile-error",
        error: "Compilation produced no output",
        diagnostics: result.diagnostics as string[] | undefined,
      } satisfies WorkerResponse);
    }
  } catch (err) {
    self.postMessage({
      type: "compile-error",
      error: err instanceof Error ? err.message : String(err),
    } satisfies WorkerResponse);
  } finally {
    compiling = false;

    if (pendingRequest) {
      const req = pendingRequest;
      pendingRequest = null;
      doCompile(req.files, req.mainFilePath);
    }
  }
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;

  switch (msg.type) {
    case "init":
      initCompiler();
      break;
    case "compile":
      if (compiling) {
        pendingRequest = msg;
      } else {
        doCompile(msg.files, msg.mainFilePath);
      }
      break;
  }
};
