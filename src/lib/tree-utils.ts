export interface FileItem {
  path: string;
  type: "typst" | "image" | "font" | "data" | "other";
  size: number;
  lastModified: Date;
}

export interface TreeFolder {
  name: string;
  path: string;
  children: (TreeFolder | TreeFile)[];
  isOpen?: boolean;
}

export interface TreeFile {
  name: string;
  path: string;
  file: FileItem;
}

export type TreeNode = TreeFolder | TreeFile;

export function getFileType(
  path: string,
): "typst" | "image" | "font" | "data" | "other" {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "typ") return "typst";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext ?? ""))
    return "image";
  if (["ttf", "otf", "woff", "woff2"].includes(ext ?? "")) return "font";
  if (["json", "csv", "yaml", "yml"].includes(ext ?? "")) return "data";
  return "other";
}

export function buildFileTree(files: FileItem[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");

      if (isLast) {
        currentLevel.push({
          name: part,
          path: currentPath,
          file: file,
        });
      } else {
        let folder = currentLevel.find(
          (node) => "children" in node && node.name === part,
        ) as TreeFolder | undefined;

        if (!folder) {
          folder = {
            name: part,
            path: currentPath,
            children: [],
          };
          currentLevel.push(folder);
        }
        currentLevel = folder.children;
      }
    }
  }

  // Sort: folders first, then files, then alphabetically
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      const aIsFolder = "children" in a;
      const bIsFolder = "children" in b;
      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if ("children" in node) {
        sortNodes(node.children);
      }
    }
  };

  sortNodes(root);
  return root;
}
