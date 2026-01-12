import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Note, Version } from '@/types/note';

interface NotesState {
    notes: Note[];
    activeNoteId: string | null;

    // Actions
    createNote: () => void;
    updateNote: (id: string, partialData: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    setActiveNote: (id: string | null) => void;
    getActiveNote: () => Note | undefined;
    saveVersion: (id: string) => void;
    restoreVersion: (id: string, versionId: string) => void;
    clearVersions: (id: string) => void;
    applyRemoteUpdate: (noteId: string, content: any, updatedAt: number) => void;
    removeNoteRemote: (noteId: string) => void;
    clearAllData: () => void;
}

export const useNotesStore = create<NotesState>()(
    persist(
        (set, get) => ({
            notes: [],
            activeNoteId: null,

            applyRemoteUpdate: (noteId, content, updatedAt) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === noteId
                            ? { ...note, content, updatedAt }
                            : note
                    ),
                }));
            },

            removeNoteRemote: (noteId) => {
                set((state) => {
                    const newNotes = state.notes.filter((note) => note.id !== noteId);
                    const newActiveId =
                        state.activeNoteId === noteId ? null : state.activeNoteId;

                    return {
                        notes: newNotes,
                        activeNoteId: newActiveId,
                    };
                });
            },

            clearAllData: () => {
                set({ notes: [], activeNoteId: null });
            },

            createNote: () => {
                const newNote: Note = {
                    id: uuidv4(),
                    title: '',
                    content: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                            },
                        ],
                    },
                    updatedAt: Date.now(),
                    versions: [],
                };

                set((state) => ({
                    notes: [newNote, ...state.notes],
                    activeNoteId: newNote.id,
                }));
            },

            updateNote: (id, partialData) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id
                            ? { ...note, ...partialData, updatedAt: Date.now() }
                            : note
                    ),
                }));
            },

            deleteNote: (id) => {
                set((state) => {
                    const newNotes = state.notes.filter((note) => note.id !== id);
                    const newActiveId =
                        state.activeNoteId === id ? null : state.activeNoteId;

                    return {
                        notes: newNotes,
                        activeNoteId: newActiveId,
                    };
                });
            },

            setActiveNote: (id) => {
                set({ activeNoteId: id });
            },

            getActiveNote: () => {
                const { notes, activeNoteId } = get();
                return notes.find((note) => note.id === activeNoteId);
            },

            saveVersion: (id) => {
                set((state) => ({
                    notes: state.notes.map((note) => {
                        if (note.id !== id) return note;

                        // Check if the current content is identical to the latest version
                        if (note.versions.length > 0) {
                            const latestVersion = note.versions[0];
                            const currentContentStr = JSON.stringify(note.content);
                            const latestContentStr = JSON.stringify(latestVersion.content);

                            if (currentContentStr === latestContentStr) {
                                return note; // No changes to save
                            }
                        }

                        const newVersion: Version = {
                            id: uuidv4(),
                            content: note.content,
                            timestamp: Date.now(),
                        };

                        return {
                            ...note,
                            versions: [newVersion, ...note.versions],
                        };
                    }),
                }));
            },

            restoreVersion: (id, versionId) => {
                set((state) => ({
                    notes: state.notes.map((note) => {
                        if (note.id !== id) return note;

                        const versionToRestore = note.versions.find((v) => v.id === versionId);
                        if (!versionToRestore) return note;

                        return {
                            ...note,
                            content: versionToRestore.content,
                            updatedAt: Date.now(),
                        };
                    }),
                }));
            },

            clearVersions: (id) => {
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, versions: [] } : note
                    ),
                }));
            },
        }),
        {
            name: 'collaborative-notes-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);
