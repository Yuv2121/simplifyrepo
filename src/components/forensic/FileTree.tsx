import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  File,
  FileType,
  Image,
  Settings,
  Database,
  Lock,
  Cog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileNode {
  path: string;
  name: string;
  type: "file" | "folder";
  size: number;
  children?: FileNode[];
  extension?: string;
}

interface FileTreeProps {
  files: FileNode[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  isLoading?: boolean;
}

// Get appropriate icon based on file extension
function getFileIcon(extension?: string) {
  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "mjs":
    case "cjs":
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case "json":
      return <FileJson className="w-4 h-4 text-amber-500" />;
    case "md":
    case "mdx":
    case "txt":
      return <FileText className="w-4 h-4 text-slate-400" />;
    case "css":
    case "scss":
    case "less":
    case "sass":
      return <FileType className="w-4 h-4 text-blue-400" />;
    case "html":
    case "htm":
      return <FileCode className="w-4 h-4 text-orange-500" />;
    case "svg":
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "ico":
    case "webp":
      return <Image className="w-4 h-4 text-purple-400" />;
    case "yaml":
    case "yml":
    case "toml":
      return <Settings className="w-4 h-4 text-rose-400" />;
    case "sql":
    case "db":
      return <Database className="w-4 h-4 text-cyan-400" />;
    case "env":
    case "lock":
      return <Lock className="w-4 h-4 text-slate-500" />;
    case "config":
      return <Cog className="w-4 h-4 text-slate-400" />;
    case "py":
      return <FileCode className="w-4 h-4 text-blue-500" />;
    case "go":
      return <FileCode className="w-4 h-4 text-cyan-500" />;
    case "rs":
      return <FileCode className="w-4 h-4 text-orange-600" />;
    case "java":
      return <FileCode className="w-4 h-4 text-red-500" />;
    case "rb":
      return <FileCode className="w-4 h-4 text-red-400" />;
    case "php":
      return <FileCode className="w-4 h-4 text-indigo-400" />;
    default:
      return <File className="w-4 h-4 text-slate-500" />;
  }
}

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

const TreeNode = memo(({ node, depth, selectedFile, onFileSelect }: TreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isFolder = node.type === "folder";
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: depth * 0.02 }}
        className={cn(
          "flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-150",
          "hover:bg-cyan-500/10 hover:border-l-2 hover:border-cyan-400/50",
          isSelected && "bg-cyan-500/20 border-l-2 border-cyan-400",
          !isSelected && "border-l-2 border-transparent"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* Expand/Collapse icon for folders */}
        {isFolder && (
          <span className="text-slate-500">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        
        {/* File/Folder icon */}
        {isFolder ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-cyan-400" />
          ) : (
            <Folder className="w-4 h-4 text-cyan-400/70" />
          )
        ) : (
          getFileIcon(node.extension)
        )}

        {/* Name */}
        <span className={cn(
          "font-mono text-sm truncate flex-1",
          isFolder ? "text-slate-300" : "text-slate-400",
          isSelected && "text-cyan-300 font-medium"
        )}>
          {node.name}
        </span>

        {/* Size indicator for files */}
        {!isFolder && node.size > 0 && (
          <span className="text-xs text-slate-600 font-mono">
            {node.size > 1024 
              ? `${(node.size / 1024).toFixed(1)}KB` 
              : `${node.size}B`
            }
          </span>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TreeNode.displayName = "TreeNode";

export const FileTree = ({ files, selectedFile, onFileSelect, isLoading }: FileTreeProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
          </div>
          <p className="text-sm text-slate-400 font-mono">Scanning repository...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Folder className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-500">No files loaded</p>
          <p className="text-xs text-slate-600">Enter a repo URL to begin</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="py-2">
        {files.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
