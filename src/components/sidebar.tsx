'use client';

import {
    Button,
    Listbox,
    ListboxItem,
    ScrollShadow,
    Tooltip
} from "@heroui/react";
import { useNotesStore } from "@/store/useNotesStore";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { collaborationManager } from "@/utils/collaboration";

const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        width="1em"
        role="presentation"
        viewBox="0 0 20 20"
        {...props}
    >
        <path
            d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        />
        <path
            d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        />
        <path
            d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        />
    </svg>
);

export default function Sidebar() {
    const { notes, createNote, setActiveNote, activeNoteId, deleteNote, clearAllData } = useNotesStore();

    const handleReset = () => {
        if (confirm("DANGER ZONE: This will delete ALL notes and settings permanently.\n\nAre you sure you want to proceed?")) {
            if (confirm("This action cannot be undone. Confirm clear all data?")) {
                clearAllData();
            }
        }
    };

    const handleSelection = (keys: any) => {
        const selectedId = Array.from(keys)[0] as string;
        setActiveNote(selectedId);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        if (confirm('Are you sure you want to delete this note?')) {
            deleteNote(id);
            collaborationManager.broadcastDelete(id);
        }
    };

    return (
        <aside className="h-full w-72 border-r border-default-200/50 bg-background/50 backdrop-blur-md md:flex flex-col flex-shrink-0 transition-all duration-300 hidden z-10">
            <div className="p-6 pb-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground/90 mb-6">
                    Collaborative Notes
                </h1>
                <Button
                    color="primary"
                    className="w-full font-medium shadow-md shadow-primary/20 transition-transform active:scale-[0.98]"
                    radius="lg"
                    variant="solid"
                    onPress={createNote}
                    startContent={<span className="text-xl leading-none">+</span>}
                >
                    New Note
                </Button>
            </div>

            <ScrollShadow className="flex-1 px-4 py-2">
                {notes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center text-default-400 mt-10 px-2 py-8 rounded-xl border border-dashed border-default-200">
                            <p className="font-medium">No notes yet</p>
                            <p className="text-tiny mt-1">Create one to get started</p>
                        </div>
                    </motion.div>
                ) : (
                    <Listbox
                        aria-label="Notes"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={activeNoteId ? new Set([activeNoteId]) : new Set()}
                        onSelectionChange={handleSelection}
                        classNames={{
                            list: "gap-1",
                        }}
                        itemClasses={{
                            base: "rounded-lg gap-3 px-3 py-3 data-[hover=true]:bg-default-100/50 data-[selected=true]:bg-default-200/60 transition-colors duration-200",
                            title: "text-sm font-medium text-foreground/90",
                            description: "text-xs text-default-400"
                        }}
                    >
                        {notes.map((item) => (
                            <ListboxItem
                                key={item.id}
                                className="group relative"
                                textValue={item.title || "Untitled Note"}
                                endContent={
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-default-400 hover:text-danger hover:bg-danger/10 min-w-8 w-8 h-8 -mr-1"
                                        onPress={undefined}
                                        onClick={(e) => handleDelete(e, item.id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                }
                            >
                                <div className="flex flex-col gap-0.5 overflow-hidden w-full pr-2">
                                    <span className={`text-sm font-medium truncate ${item.id === activeNoteId ? 'text-primary' : 'text-foreground'}`}>
                                        {item.title || "Untitled Note"}
                                    </span>
                                    <span className="text-xs text-default-400 truncate">
                                        {typeof item.content === 'string' ? (item.content || "Empty note") : "Rich text note"}
                                    </span>
                                </div>
                            </ListboxItem>
                        ))}
                    </Listbox>
                )}
            </ScrollShadow>



            <div className="p-4 border-t border-default-100 mt-auto flex items-center gap-2">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-default-100/50 transition-colors cursor-pointer flex-1 overflow-hidden">
                    <div className="h-8 w-8 min-w-8 rounded-full bg-default-100 border border-default-200 flex items-center justify-center text-default-500 text-xs font-bold">
                        U
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-small font-semibold text-foreground/80 truncate">User</span>
                        <span className="text-tiny text-default-400 truncate">Pro Plan</span>
                    </div>
                </div>
                <Tooltip content="Reset Application">
                    <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={undefined}
                        onClick={handleReset}
                        className="text-default-400 hover:text-danger"
                    >
                        <Trash2 size={18} />
                    </Button>
                </Tooltip>
            </div>
        </aside >
    );
}
