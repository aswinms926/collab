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
    const editorContent = content || note?.content;
    // We don't key the editor itself by ID, we let parent handle remounting if needed.
    // Parent currently has key={note.id}, so this component remounts on note switch.

    const editor = useEditor({
        extensions,
        content: editorContent,
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[${editable ? '300px' : 'auto'}] max-w-none text-foreground leading-[1.8] font-normal`,
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getJSON());
            }
        },
    });

    // Content sync effect
    useEffect(() => {
        if (!editor || !editorContent) return;

        const currentContent = editor.getJSON();
        // Simple deep sync check
        if (JSON.stringify(currentContent) !== JSON.stringify(editorContent)) {
            // Save selection
            const { from, to } = editor.state.selection;

            // update content silently
            editor.commands.setContent(editorContent, { emitUpdate: false });

            // Attempt to restore selection (basic)
            try {
                editor.commands.setTextSelection({ from, to });
            } catch (e) {
                // If selection is invalid, ignore
            }
        }
    }, [editor, editorContent]);

    return (
        <div className="flex flex-col">
            {editable && <TiptapToolbar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
}

