import { ChatUserstate, Client } from 'tmi.js';

class TmiClientMock extends Client {
    lastMessage: string = 'no-message-sent';
}

export class TmiClientMockHelper {
    static mockClient(): void {
        jest.spyOn(TmiClientMock.prototype, 'say').mockImplementation(function (this: TmiClientMock, channel, message) {
            this.lastMessage = message;

            return Promise.resolve([message]);
        });
    }

    static createClient(): TmiClientMock {
        return new TmiClientMock({
            options: { debug: true, messagesLogLevel: 'info' },
            connection: {
                reconnect: true,
                secure: true
            },
            channels: ['testChannel']
        });
    }

    static createChatUserstate(): ChatUserstate {
        return {
            username: 'testviewer'
        }
    }
}

