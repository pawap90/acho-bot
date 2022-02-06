import { TmiCommandManager } from '../src/commands/tmi-command.manager';
import { BuiltInCommandsLoader } from '../src/commands/loaders/builtin-commands.loader';
import { TmiClientMockHelper } from './tmi.mock';
import { CommandCache } from '../src/cache/command.cache';
import { AppCache } from '../src/cache/cache.service';


const testChannelName = '@testChannel';

beforeAll(() => {
    TmiClientMockHelper.mockClient();
});

afterEach(() => {
    AppCache.flushAll();
});

afterAll(() => {
    jest.restoreAllMocks();
});

async function loadBuiltinCommands(): Promise<TmiCommandManager> {
    const commandManager = new TmiCommandManager({
        loaders: [new BuiltInCommandsLoader()]
    });
    await commandManager.loadCommands();
    return commandManager;
}

describe('built-in refresh command ', () => {

    it('clears the cache', async () => {
        const commandManager = await loadBuiltinCommands();
        const client = TmiClientMockHelper.createClient(testChannelName);
        const command = await commandManager.getCommand('!refresh');

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate(testChannelName.substring(1)));

        expect(CommandCache.get()).toBe(null);
    });

    it('reloads after calling a new command', async () => {
        const commandManager = await loadBuiltinCommands();
        const client = TmiClientMockHelper.createClient(testChannelName);
        const command = await commandManager.getCommand('!refresh');

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate(testChannelName.substring(1)));

        expect(CommandCache.get()).toBe(null);

        const newCommand = await commandManager.getCommand('!help');
        newCommand.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate(testChannelName.substring(1)));

        expect(CommandCache.get()).not.toBe(null);
        expect(client.lastMessage).toBe('!help');

    });

    it('is not available to viewers', async () => {
        const commandManager = await loadBuiltinCommands();
        const client = TmiClientMockHelper.createClient(testChannelName);
        const command = await commandManager.getCommand('!refresh');

        command.execute(testChannelName, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).toBe('Not enough permissions');
    });
});