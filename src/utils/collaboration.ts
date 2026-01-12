import { Note } from "@/types/note";

export type CollaborationMessage =
    | {
        type: 'UPDATE_NOTE';
        payload: {
            clientId: string;
            noteId: string;
            content: any;
            updatedAt: number;
        };
    }
    | {
        type: 'DELETE_NOTE';
        payload: {
            clientId: string;
            noteId: string;
        };
    };

class CollaborationManager {
    private channel: BroadcastChannel | null = null;
    private clientId: string;
    private messageHandler: ((message: CollaborationMessage) => void) | null = null;
    private channelName = 'notes-collaboration';

    constructor() {
        // Generate a unique client ID for this session
        this.clientId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    public init(onMessage: (message: CollaborationMessage) => void) {
        if (typeof window === 'undefined') return;

        if (!this.channel) {
            this.channel = new BroadcastChannel(this.channelName);
        }

        this.messageHandler = onMessage;

        this.channel.onmessage = (event: MessageEvent<CollaborationMessage>) => {
            // Ensure payload exists and check clientId
            if (event.data && event.data.payload && event.data.payload.clientId !== this.clientId) {
                if (this.messageHandler) {
                    this.messageHandler(event.data);
                }
            }
        };
    }

    public broadcastUpdate(noteId: string, content: any, updatedAt: number) {
        if (!this.channel) return;

        const message: CollaborationMessage = {
            type: 'UPDATE_NOTE',
            payload: {
                clientId: this.clientId,
                noteId,
                content,
                updatedAt
            }
        };

        this.channel.postMessage(message);
    }

    public broadcastDelete(noteId: string) {
        if (!this.channel) return;

        const message: CollaborationMessage = {
            type: 'DELETE_NOTE',
            payload: {
                clientId: this.clientId,
                noteId
            }
        };

        this.channel.postMessage(message);
    }

    public disconnect() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
        this.messageHandler = null;
    }

    public getClientId() {
        return this.clientId;
    }
}

// Singleton instance
export const collaborationManager = new CollaborationManager();
