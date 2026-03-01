import { useState, useRef, useEffect, useCallback } from "react";

interface UseTerminalInputOptions {
  onEscape?: () => void;
}

export function useTerminalInput(options: UseTerminalInputOptions = {}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && options.onEscape) {
        options.onEscape();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options]);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const clearInput = useCallback(() => {
    setInput("");
  }, []);

  return {
    input,
    setInput,
    inputRef,
    outputRef,
    scrollToBottom,
    focusInput,
    clearInput,
  };
}
