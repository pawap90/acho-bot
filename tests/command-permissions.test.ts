import { TmiCommandManager } from '../src/commands/tmi-command.manager';

import { TmiClientMockHelper } from './tmi.mock';
import {
    BroadcasterOnlyCommandsLoader,
    DynamicPermissionsCommandsLoader,
    ModeratorOnlyCommandsLoader,
    NoPermissionsCommandsLoader,
    SpecificUserOnlyCommandsLoader,
    SubscriberOnlyCommandsLoader,
    ViewerOnlyCommandsLoader
} from './command-loader.mock';
import { AppCache } from '../src/cache/cache.service';
import { ICommandLoader, Role } from '../src/commands/itmi.command';

const testBroadcaster = '@testbroadcaster';

beforeAll(() => {
    TmiClientMockHelper.mockClient();
});

afterEach(() => {
    AppCache.flushAll();
});

afterAll(() => {
    jest.restoreAllMocks();
});

async function initCommandManagerAndClient(config: { loaders: ICommandLoader[], channel?: string, moderators?: string[] }) {
    const commandManager = new TmiCommandManager({
        loaders: config.loaders
    });
    commandManager.loadCommands();

    const client = TmiClientMockHelper.createClient(config.channel ?? testBroadcaster, config.moderators);

    return { commandManager, client };
}

describe('command permissions ', () => {

    it('allow Broadcaster to invoke Broadcaster-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new BroadcasterOnlyCommandsLoader()]
        });

        const command = await commandManager.getCommand('!broadcasterOnlyTest');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate(testBroadcaster.substring(1)));

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Broadcaster to invoke [Broadcaster, Moderator] commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new DynamicPermissionsCommandsLoader([Role.Broadcaster, Role.Moderator])]
        });

        const command = await commandManager.getCommand('!dynamic');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate(testBroadcaster.substring(1)));

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Broadcaster to invoke no-permission commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new NoPermissionsCommandsLoader()]
        });

        const command = await commandManager.getCommand('!everyone');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate(testBroadcaster.substring(1)));

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('prevent Broadcaster to invoke Moderator-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new ModeratorOnlyCommandsLoader()]
        });

        const command = await commandManager.getCommand('!moderatorOnlyTest');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate(testBroadcaster.substring(1)));

        expect(client.lastMessage).toBe('Not enough permissions');
    });


    it('allow Moderator to invoke Moderator-only commands', async () => {
        const moderatorUsername = 'missModerator';
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new ModeratorOnlyCommandsLoader()],
            moderators: [moderatorUsername]
        });

        const command = await commandManager.getCommand('!moderatorOnlyTest');
        command.execute(testBroadcaster, client, {
            username: moderatorUsername,
            mod: true
        });

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Moderator to invoke [Moderator, Broadcaster] commands', async () => {
        const moderatorUsername = 'missModerator';
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new DynamicPermissionsCommandsLoader([Role.Moderator, Role.Broadcaster])],
            moderators: [moderatorUsername]
        });

        const command = await commandManager.getCommand('!dynamic');
        command.execute(testBroadcaster, client, {
            username: moderatorUsername,
            mod: true
        });

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Moderator to invoke no-permission commands', async () => {
        const moderatorUsername = 'missModerator';
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new NoPermissionsCommandsLoader()],
            moderators: [moderatorUsername]
        });

        const command = await commandManager.getCommand('!everyone');
        command.execute(testBroadcaster, client, {
            username: moderatorUsername,
            mod: true
        });

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('prevent Moderator to invoke Broadcaster-only commands', async () => {
        const moderatorUsername = 'missModerator';
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new BroadcasterOnlyCommandsLoader()],
            moderators: [moderatorUsername]
        });

        const command = await commandManager.getCommand('!broadcasterOnlyTest');
        command.execute(testBroadcaster, client, {
            username: moderatorUsername,
            mod: true
        });

        expect(client.lastMessage).toBe('Not enough permissions');
    });

    it('allow Subscriber to invoke Subscriber-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new SubscriberOnlyCommandsLoader()]
        });

        const command = await commandManager.getCommand('!subscriberOnlyTest');
        command.execute(testBroadcaster, client, {
            username: 'subscriberOne',
            subscriber: true
        });

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Subscriber to invoke [Subscriber, Broadcaster] commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new DynamicPermissionsCommandsLoader([Role.Subscriber, Role.Broadcaster])]
        });

        const command = await commandManager.getCommand('!dynamic');
        command.execute(testBroadcaster, client, {
            username: 'subscriberOne',
            subscriber: true
        });

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Subscriber to invoke no-permission commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new NoPermissionsCommandsLoader()]
        });

        const command = await commandManager.getCommand('!everyone');
        command.execute(testBroadcaster, client, {
            username: 'subscriberOne',
            subscriber: true
        });

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('prevent Subscriber to invoke Broadcaster or Moderator-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new ModeratorOnlyCommandsLoader(), new BroadcasterOnlyCommandsLoader()]
        });

        const commandModerator = await commandManager.getCommand('!moderatorOnlyTest');
        commandModerator.execute(testBroadcaster, client, {
            username: 'subscriberOne',
            subscriber: true
        });

        expect(client.lastMessage).toBe('Not enough permissions');

        const commandBroadcaster = await commandManager.getCommand('!broadcasterOnlyTest');
        commandBroadcaster.execute(testBroadcaster, client, {
            username: 'subscriberOne',
            subscriber: true
        });

        expect(client.lastMessage).toBe('Not enough permissions');
    });

    it('allow Viewer to invoke Viewer-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new ViewerOnlyCommandsLoader()]
        });

        const command = await commandManager.getCommand('!viewerOnlyTest');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Viewer to invoke [Viewer, Broadcaster] commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new DynamicPermissionsCommandsLoader([Role.Viewer, Role.Broadcaster])]
        });

        const command = await commandManager.getCommand('!dynamic');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow Viewer to invoke no-permission commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new NoPermissionsCommandsLoader()]
        });

        const command = await commandManager.getCommand('!everyone');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('prevent Viewer to invoke Broadcaster or usr:specific-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new BroadcasterOnlyCommandsLoader(), new SpecificUserOnlyCommandsLoader()]
        });

        const commandBroadcaster = await commandManager.getCommand('!broadcasterOnlyTest');
        commandBroadcaster.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).toBe('Not enough permissions');

        const commandUser = await commandManager.getCommand('!userOnlyTest');
        commandUser.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate());

        expect(client.lastMessage).toBe('Not enough permissions');
    });

    it('allow usr:mrtest to invoke usr:mrtest-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new SpecificUserOnlyCommandsLoader()]
        });

        const command = await commandManager.getCommand('!userOnlyTest');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate('mrtest'));

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow usr:specific to invoke [usr:specific, Broadcaster] commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new DynamicPermissionsCommandsLoader([Role.Broadcaster, 'usr:mrtest'])]
        });

        const command = await commandManager.getCommand('!dynamic');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate('mrtest'));

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('allow usr:specific to invoke no-permission commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new NoPermissionsCommandsLoader()]
        });

        const command = await commandManager.getCommand('!everyone');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate('mrtest'));

        expect(client.lastMessage).not.toBe('Not enough permissions');
    });

    it('prevent usr:specific to invoke Broadcaster or usr:another-only commands', async () => {
        const { commandManager, client } = await initCommandManagerAndClient({
            loaders: [new BroadcasterOnlyCommandsLoader()]
        });

        const command = await commandManager.getCommand('!broadcasterOnlyTest');
        command.execute(testBroadcaster, client, TmiClientMockHelper.createChatUserstate('mrtest'));

        expect(client.lastMessage).toBe('Not enough permissions');
    });

});