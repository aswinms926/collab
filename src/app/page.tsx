'use client';

import { useNotesStore } from "@/store/useNotesStore";
import EditorPlaceholder from "@/components/editor-placeholder";
import Editor from "@/components/editor";
import { useEffect, useState } from "react";

export default function Home() {
  const activeNoteId = useNotesStore((state) => state.activeNoteId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-background">
        {/* Loading state or just empty */}
      </div>
    )
  }

  if (activeNoteId) {
    return <Editor />;
  }

  return (
    <EditorPlaceholder />
  );
}
