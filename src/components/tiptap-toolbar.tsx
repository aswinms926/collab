'use client';

import { Button } from "@heroui/react";
import { useCurrentEditor } from "@tiptap/react";
import { Bold, Italic, Code, List } from "lucide-react";

export default function TiptapToolbar() {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 p-2 bg-content1/50 backdrop-blur-md rounded-xl border border-divider/50 shadow-sm mb-4 w-fit">
            <Button
                isIconOnly
                size="sm"
                variant={editor.isActive("bold") ? "solid" : "light"}
                color={editor.isActive("bold") ? "primary" : "default"}
                onPress={() => editor.chain().focus().toggleBold().run()}
                className="min-w-8 w-8 h-8"
            >
                <Bold size={16} strokeWidth={2.5} />
            </Button>
            <Button
                isIconOnly
                size="sm"
                variant={editor.isActive("italic") ? "solid" : "light"}
                color={editor.isActive("italic") ? "primary" : "default"}
                onPress={() => editor.chain().focus().toggleItalic().run()}
                className="min-w-8 w-8 h-8"
            >
                <Italic size={16} strokeWidth={2.5} />
            </Button>
            <div className="w-px h-4 bg-divider mx-1" />
            <Button
                isIconOnly
                size="sm"
                variant={editor.isActive("bulletList") ? "solid" : "light"}
                color={editor.isActive("bulletList") ? "primary" : "default"}
                onPress={() => editor.chain().focus().toggleBulletList().run()}
                className="min-w-8 w-8 h-8"
            >
                <List size={16} strokeWidth={2.5} />
            </Button>
            <Button
                isIconOnly
                size="sm"
                variant={editor.isActive("codeBlock") ? "solid" : "light"}
                color={editor.isActive("codeBlock") ? "primary" : "default"}
                onPress={() => editor.chain().focus().toggleCodeBlock().run()}
                className="min-w-8 w-8 h-8"
            >
                <Code size={16} strokeWidth={2.5} />
            </Button>
        </div>
    );
}
