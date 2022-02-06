import { ChatUserstate, Client } from 'tmi.js';

class TmiClientMock extends Client {
    lastMessage: string = 'no-message-sent';
    moderators: string[] = []
}

export class TmiClientMockHelper {
    static mockClient(): void {
        jest.spyOn(TmiClientMock.prototype, 'say').mockImplementation(function (this: TmiClientMock, channel, message) {
            this.lastMessage = message;

            return Promise.resolve([message]);
        });

        jest.spyOn(TmiClientMock.prototype, 'isMod').mockImplementation(function (this: TmiClientMock, channel, user) {
            return this.moderators.includes(user);
        });
    }

    static createClient(channel?: string, mods?: string[]): TmiClientMock {
        const client = new TmiClientMock({
            options: { debug: true, messagesLogLevel: 'info' },
            connection: {
                reconnect: true,
                secure: true
            },
            channels: [channel ?? 'testChannel']
        });
        if (mods)
            client.moderators = mods;
        return client;
    }

    static createChatUserstate(username?: string): ChatUserstate {
        return {
            username: username ?? 'testviewer'
        }
    }
}

