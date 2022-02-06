import { Client as TmiClient, ChatUserstate as TmiChatUserState } from 'tmi.js';

export enum Role {
    Broadcaster = 'Broadcaster',
    Moderator = 'Moderator',
    Subscriber = 'Subscriber',
    Viewer = 'Viewer'
}

export type Permissions = (string | Role);

export interface ITmiCommand {
    name: string;
    description: string;
    permissions: Permissions[];
    execute(channel: string, client: TmiClient, tags: TmiChatUserState): void;
}

export type TmiCommandDictionary = { 
    [key: string]: ITmiCommand 
}

export interface ICommandLoader {
    load(): Promise<TmiCommandDictionary>
}