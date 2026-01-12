'use client';

import { useEffect, useState, useRef } from 'react';
import { Input, Button, Tooltip, useDisclosure } from "@heroui/react";
import { useNotesStore } from "@/store/useNotesStore";
import { Note } from "@/types/note";
import { motion } from "framer-motion";
import { toast } from "sonner";
import TiptapEditor from "./tiptap-editor";
import VersionHistory from "./version-history";
import { Save, History } from "lucide-react";

import { collaborationManager, CollaborationMessage } from "@/utils/collaboration";

function useDebouncedUpdate(value: any, delay: number, callback: (val: any) => void) {
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        const handler = setTimeout(() => {
            callback(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
}

export default function Editor() {
    const { getActiveNote, updateNote, activeNoteId } = useNotesStore();
    const note = getActiveNote();

    if (!note || !activeNoteId) return null;

    return <EditorContent note={note} updateNote={updateNote} key={note.id} />;
}

function EditorContent({ note, updateNote }: { note: Note, updateNote: (id: string, data: Partial<Note>) => void }) {
    const [title, setTitle] = useState(note.title);
    const { saveVersion, restoreVersion, applyRemoteUpdate } = useNotesStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [remoteIndicator, setRemoteIndicator] = useState(false);

    useDebouncedUpdate(title, 500, (val) => {
        updateNote(note.id, { title: val });
        // Optional: Broadcast title if needed, but requirements focus on content
    });

    // Setup Collaboration
    useEffect(() => {
        collaborationManager.init((msg: CollaborationMessage) => {
            if (msg.type === 'UPDATE_NOTE') {
                // Apply update to store (whether it's current note or not)
                applyRemoteUpdate(msg.payload.noteId, msg.payload.content, msg.payload.updatedAt);

                // If it's the current note, show indicator
                if (msg.payload.noteId === note.id) {
                    setRemoteIndicator(true);
                    setTimeout(() => setRemoteIndicator(false), 2000);
                }
            } else if (msg.type === 'DELETE_NOTE') {
                const { removeNoteRemote } = useNotesStore.getState();
                removeNoteRemote(msg.payload.noteId);
            }
        });

        return () => {
            collaborationManager.disconnect();
        };
    }, [note.id, applyRemoteUpdate]);


    // Content update is handled directly via callback from TiptapEditor which has its own internal state management mechanism (or we debounce there)
    // Tiptap's onUpdate is frequent, so we might want to debounce the store call here or inside TiptapEditor
    // For simplicity, let's debounce the callback wrapper here.
    const debouncedContentUpdate = useRef((content: any) => { });

    useEffect(() => {
        const handler = setTimeout(() => { }, 0);
        let timeout: NodeJS.Timeout;

        debouncedContentUpdate.current = (content: any) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Local Update
                updateNote(note.id, { content });
                // Broadcast Update
                collaborationManager.broadcastUpdate(note.id, content, Date.now());
            }, 1000); // 1s debounce for rich text
        };
        return () => clearTimeout(timeout);
    }, [note.id, updateNote]);


    const handleSaveVersion = () => {
        saveVersion(note.id);
        toast.success("Version saved successfully");
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="h-full flex flex-col w-full bg-background relative">
                    {/* Remote Update Indicator */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: remoteIndicator ? 1 : 0, y: remoteIndicator ? 0 : -20 }}
                    >
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                            <div className="bg-primary/10 backdrop-blur-md border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Updated by another user
                            </div>
                        </div>
                    </motion.div>

                    <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
                        {/* Header area with Title + Actions */}
                        <div className="px-8 pt-8 pb-4 shrink-0 z-20 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                                <Input
                                    classNames={{
                                        input: "text-4xl md:text-5xl font-extrabold placeholder:text-default-200 text-foreground",
                                        inputWrapper: "h-auto bg-transparent shadow-none px-0 border-none hover:bg-transparent focus-within:bg-transparent",
                                        innerWrapper: "bg-transparent",
                                    }}
                                    placeholder="Untitled Note"
                                    variant="flat"
                                    size="lg"
                                    aria-label="Note Title"
                                    radius="none"
                                    value={title}
                                    onValueChange={setTitle}
                                />

                                <div className="flex items-center gap-2 mt-2">
                                    <Tooltip content="View History">
                                        <button
                                            className="p-2 rounded-lg hover:bg-default-100 transition-colors text-default-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            onClick={onOpen}
                                        >
                                            <History size={20} />
                                        </button>
                                    </Tooltip>
                                    <Tooltip content="Save Version">
                                        <button
                                            className="p-2 rounded-lg hover:bg-default-100 transition-colors text-default-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            onClick={handleSaveVersion}
                                        >
                                            <Save size={20} />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-default-400 text-sm px-1 font-medium select-none border-b border-divider/10 pb-4">
                                <span className="bg-default-100 px-2 py-0.5 rounded-md text-xs">
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span className="text-tiny text-default-400">
                                    {note.versions?.length || 0} versions
                                </span>
                            </div>
                        </div>

                        {/* Main Editor Area */}
                        <div className="flex-1 min-h-0 relative px-8 pb-20 overflow-y-auto">
                            <TiptapEditor
                                note={note}
                                onChange={(json) => debouncedContentUpdate.current(json)}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <VersionHistory
                isOpen={isOpen}
                onClose={onOpenChange}
                note={note}
                onRestore={(vid) => restoreVersion(note.id, vid)}
                onClear={() => {
                    const { clearVersions } = useNotesStore.getState();
                    clearVersions(note.id);
                }}
            />
        </>
    );
}
