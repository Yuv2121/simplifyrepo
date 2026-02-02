import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FileNode {
  path: string;
  name: string;
  type: "file" | "folder";
  size: number;
  children?: FileNode[];
  extension?: string;
}

interface ForensicAnalysis {
  purpose: string;
  logicFlow: string;
  keyComponents: Array<{
    name: string;
    type: string;
    description: string;
    lineRange?: string;
  }>;
  vulnerabilities: Array<{
    severity: "low" | "medium" | "high" | "critical";
    issue: string;
    suggestion: string;
  }>;
  imports: string[];
  complexity: "simple" | "moderate" | "complex" | "unknown";
  suggestions: string[];
}

interface FileAnalysisResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileContent: string;
  analysis: ForensicAnalysis;
}

interface ForensicLog {
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

// Build tree structure from flat file list
function buildFileTree(files: Array<{ path: string; type: string; size: number }>): FileNode[] {
  const root: FileNode[] = [];
  const pathMap = new Map<string, FileNode>();

  // Sort files so folders come before their contents
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sortedFiles) {
    const parts = file.path.split("/");
    const name = parts[parts.length - 1];
    const extension = file.type === "file" ? name.split(".").pop()?.toLowerCase() : undefined;

    const node: FileNode = {
      path: file.path,
      name,
      type: file.type as "file" | "folder",
      size: file.size,
      extension,
      children: file.type === "folder" ? [] : undefined,
    };

    pathMap.set(file.path, node);

    if (parts.length === 1) {
      root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join("/");
      const parent = pathMap.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      } else {
        // Parent folder doesn't exist yet, create it
        let currentPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          const newPath = currentPath ? `${currentPath}/${part}` : part;
          
          if (!pathMap.has(newPath)) {
            const folderNode: FileNode = {
              path: newPath,
              name: part,
              type: "folder",
              size: 0,
              children: [],
            };
            pathMap.set(newPath, folderNode);
            
            if (currentPath) {
              const parentFolder = pathMap.get(currentPath);
              if (parentFolder?.children) {
                parentFolder.children.push(folderNode);
              }
            } else {
              root.push(folderNode);
            }
          }
          currentPath = newPath;
        }
        
        // Now add the file to its parent
        const actualParent = pathMap.get(parentPath);
        if (actualParent?.children) {
          actualParent.children.push(node);
        }
      }
    }
  }

  // Sort: folders first, then files, alphabetically
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    }).map(node => ({
      ...node,
      children: node.children ? sortNodes(node.children) : undefined,
    }));
  };

  return sortNodes(root);
}

export const useForensic = () => {
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [repoName, setRepoName] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FileAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<ForensicLog[]>([]);

  const addLog = useCallback((message: string, type: ForensicLog["type"] = "info") => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const fetchFileTree = useCallback(async (repoUrl: string) => {
    setIsLoadingTree(true);
    setError(null);
    setFileTree([]);
    setAnalysisResult(null);
    setSelectedFile(null);
    clearLogs();

    addLog("> Initializing forensic scan...", "info");
    addLog(`> Target repository: ${repoUrl}`, "info");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error("Authentication required");
      }

      addLog("> Handshaking with GitHub API...", "info");
      addLog("> Fetching repository structure...", "info");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ repoUrl, mode: "tree" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch file tree");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch file tree");
      }

      addLog(`> Retrieved ${data.files.length} items`, "success");
      addLog("> Building file tree structure...", "info");

      const tree = buildFileTree(data.files);
      setFileTree(tree);
      setRepoName(data.repoName);

      addLog("> Evidence locker ready. Select a file to analyze.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      addLog(`> ERROR: ${message}`, "error");
    } finally {
      setIsLoadingTree(false);
    }
  }, [addLog, clearLogs]);

  const analyzeFile = useCallback(async (repoUrl: string, filePath: string) => {
    setIsAnalyzing(true);
    setError(null);
    setSelectedFile(filePath);
    setAnalysisResult(null);

    const fileName = filePath.split("/").pop() || filePath;
    addLog(`> Initiating forensic analysis: ${fileName}`, "info");
    addLog("> Extracting file content from GitHub...", "info");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error("Authentication required");
      }

      addLog("> Running heuristic code scan...", "info");
      addLog("> Invoking AI analysis engine...", "info");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ repoUrl, filePath, mode: "forensic" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze file");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      addLog("> Parsing vulnerability signatures...", "info");
      addLog("> Generating forensic report...", "info");

      setAnalysisResult({
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        fileContent: data.fileContent,
        analysis: data.analysis,
      });

      addLog(`> Analysis complete: ${fileName}`, "success");
      
      if (data.analysis.vulnerabilities?.length > 0) {
        addLog(`> WARNING: ${data.analysis.vulnerabilities.length} potential vulnerabilities detected`, "warning");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      addLog(`> ERROR: ${message}`, "error");
    } finally {
      setIsAnalyzing(false);
    }
  }, [addLog]);

  const reset = useCallback(() => {
    setFileTree([]);
    setRepoName("");
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    setLogs([]);
    setIsLoadingTree(false);
    setIsAnalyzing(false);
  }, []);

  return {
    isLoadingTree,
    isAnalyzing,
    fileTree,
    repoName,
    selectedFile,
    analysisResult,
    error,
    logs,
    fetchFileTree,
    analyzeFile,
    reset,
    addLog,
  };
};
