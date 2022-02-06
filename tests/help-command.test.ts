import { TmiCommandManager } from '../src/commands/tmi-command.manager'
import { BuiltInCommandsLoader } from '../src/commands/loaders/builtin-commands.loader'

import { TmiClientMockHelper } from './tmi.mock';
import { CommandCache } from '../src/cache/command.cache';
import { BroadcasterOnlyCommandsLoader, MixedPermissionsCommandsLoader, ModeratorOnlyCommandsLoader, SpecificUserOnlyCommandsLoader, SubscriberOnlyCommandsLoader } from './command-loader.mock';
import { AppCache } from '../src/cache/cache.service';

const testChannelName = 'testChannel'

beforeAll(() => {
    TmiClientMockHelper.mockClient()
})

afterEach(() => {
    AppCache.flushAll();
})

afterAll(() => {
    jest.restoreAllMocks();
});

async function loadBuiltinCommands(): Promise<TmiCommandManager> {
    const commandManager = new TmiCommandManager({
        loaders: [new BuiltInCommandsLoader()]
    })
    await commandManager.loadCommands();
    return commandManager;
}

describe('built-in help command ', () => {

    it('prints the available commands', async () => {
        const commandManager = await loadBuiltinCommands();
        const client = TmiClientMockHelper.createClient();
        const command = await commandManager.getCommand('!help');

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).toBe('!help');
    });

    it('doesnt produce a message if no commands are available', async () => {
        const commandManager = await loadBuiltinCommands();
        const client = TmiClientMockHelper.createClient();
        const command = await commandManager.getCommand('!help');

        CommandCache.clear();

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate());

        // Check if the produced message matches the default lastMessage value of our mock
        // meaning the command didn't produce any messages.
        expect(client.lastMessage).toBe(TmiClientMockHelper.createClient().lastMessage);
    });

    it('doesnt print private commands with Broadcaster, Moderator or user specific permissions only', async () => {
        const commandManager = new TmiCommandManager({
            loaders: [
                new BroadcasterOnlyCommandsLoader(), 
                new ModeratorOnlyCommandsLoader(), 
                new SpecificUserOnlyCommandsLoader(), 
                new SubscriberOnlyCommandsLoader(), 
                new BuiltInCommandsLoader()
            ]
        });
        commandManager.loadCommands();

        const client = TmiClientMockHelper.createClient();
        const command = await commandManager.getCommand('!help');

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).toBe('!help, !subscriberOnlyTest');
    });

    it('prints commands with private and public permissions mixed', async () => {
        const commandManager = new TmiCommandManager({
            loaders: [
                new MixedPermissionsCommandsLoader(),
                new ModeratorOnlyCommandsLoader(), 
                new BuiltInCommandsLoader()
            ]
        });
        commandManager.loadCommands();

        const client = TmiClientMockHelper.createClient();
        const command = await commandManager.getCommand('!help');

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).toBe('!broadcasterSubscriber, !help, !moderatorViewer, !userSubscriber');
    });

})