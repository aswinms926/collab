'use client';

import { useEditor, EditorContent, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import TiptapToolbar from "./tiptap-toolbar";
import { Note } from "@/types/note";

const extensions = [
    StarterKit.configure({
        heading: false, // We handle title separately
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
    Placeholder.configure({
        placeholder: "Start typing...",
        emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-default-300 before:float-left before:pointer-events-none before:h-0",
    }),
];

interface TiptapEditorProps {
    note?: Note;
    content?: any;
    onChange?: (content: any) => void;
    editable?: boolean;
}

export default function TiptapEditor({ note, content, onChange, editable = true }: TiptapEditorProps) {
    const initialContent = content || note?.content;
    const editorKey = note?.id || "preview";

    return (
        <EditorProvider
            slotBefore={editable ? <TiptapToolbar /> : null}
            extensions={extensions}
            content={initialContent}
            editable={editable}
            immediatelyRender={false}
            editorProps={{
                attributes: {
                    class: `prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[${editable ? '300px' : 'auto'}] max-w-none text-foreground leading-[1.8] font-normal`,
                }
            }}
            onUpdate={({ editor }) => {
                if (onChange) {
                    const json = editor.getJSON();
                    onChange(json);
                }
            }}
            key={editorKey}
        >
        </EditorProvider>
    );
}

