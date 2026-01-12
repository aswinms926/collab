'use client';

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    ScrollShadow,
    Accordion,
    AccordionItem
} from "@heroui/react";
import { Note } from "@/types/note";
import { Trash2, Clock, RotateCcw } from "lucide-react";
import TiptapEditor from "./tiptap-editor";

interface VersionHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note;
    onRestore: (versionId: string) => void;
    onClear: () => void;
}

export default function VersionHistory({ isOpen, onClose, note, onRestore, onClear }: VersionHistoryProps) {
    const handleRestore = (id: string) => {
        if (confirm("Are you sure? This will overwrite your current note.")) {
            onRestore(id);
            onClose();
        }
    }

    const handleClear = () => {
        if (confirm("Are you sure you want to delete ALL saved versions? This cannot be undone.")) {
            onClear();
            onClose();
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            backdrop="blur"
            classNames={{
                base: "bg-content1",
                header: "border-b border-divider",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-lg font-bold">Version History</h2>
                            <p className="text-sm font-normal text-default-500">
                                {note.versions.length} saved versions
                            </p>
                        </ModalHeader>
                        <ModalBody className="p-0">
                            <ScrollShadow className="max-h-[600px]">
                                {note.versions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-default-400 gap-2">
                                        <Clock size={32} className="opacity-50" />
                                        <p>No versions saved yet.</p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        <Accordion variant="splitted">
                                            {note.versions.map((version) => (
                                                <AccordionItem
                                                    key={version.id}
                                                    aria-label={`Version from ${new Date(version.timestamp).toLocaleString()}`}
                                                    title={
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-semibold text-small">
                                                                {new Date(version.timestamp).toLocaleDateString()}
                                                            </span>
                                                            <span className="text-tiny text-default-400">
                                                                {new Date(version.timestamp).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    }
                                                    startContent={
                                                        <Clock size={20} className="text-default-400" />
                                                    }
                                                >
                                                    <div className="flex flex-col gap-4 pb-2">
                                                        <div className="max-h-[200px] overflow-y-auto border border-divider/50 rounded-lg p-2 bg-content2/50 relative">
                                                            <div className="pointer-events-none select-none">
                                                                <TiptapEditor
                                                                    content={version.content}
                                                                    editable={false}
                                                                    // Force re-render per version to avoid stale content
                                                                    key={version.id}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                color="warning"
                                                                variant="flat"
                                                                startContent={<RotateCcw size={16} />}
                                                                onPress={() => handleRestore(version.id)}
                                                            >
                                                                Restore this Version
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                )}
                            </ScrollShadow>
                        </ModalBody>
                        <ModalFooter className="flex justify-between">
                            {note.versions.length > 0 && (
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={handleClear}
                                    startContent={<Trash2 size={18} />}
                                >
                                    Clear History
                                </Button>
                            )}
                            <Button color="default" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
