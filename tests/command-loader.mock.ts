import { ICommandLoader, Permissions, Role, TmiCommandDictionary } from "../src/commands/itmi.command";
import AchoBotDynamicTextCommand from "../src/commands/achobot-dynamic-text.command";

export class BroadcasterOnlyCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!broadcasterOnlyTest': new AchoBotDynamicTextCommand('!broadcasterOnlyTest', 'Command only available for broadcaster', 'only the broadcaster can invoke me', [Role.Broadcaster])
        }
    }
}

export class ModeratorOnlyCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!moderatorOnlyTest': new AchoBotDynamicTextCommand('!moderatorOnlyTest', 'Command only available for moderator', 'only the moderator can invoke me', [Role.Moderator])
        }
    }
}

export class SubscriberOnlyCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!subscriberOnlyTest': new AchoBotDynamicTextCommand('!subscriberOnlyTest', 'Command only available for subscriber', 'only the subscriber can invoke me', [Role.Subscriber])
        }
    }
}

export class ViewerOnlyCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!viewerOnlyTest': new AchoBotDynamicTextCommand('!viewerOnlyTest', 'Command only available for viewer', 'only the viewer can invoke me', [Role.Viewer])
        }
    }
}

export class SpecificUserOnlyCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!userOnlyTest': new AchoBotDynamicTextCommand('!userOnlyTest', 'Command only available for specific user', 'only the user can invoke me', ['usr:mrtest'])
        }
    }
}

export class MixedPermissionsCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!broadcasterSubscriber': new AchoBotDynamicTextCommand('!broadcasterSubscriber', 'Command only available for broadcaster and subscribers', 'only the broadcaster and subscribers can invoke me', [Role.Broadcaster, Role.Subscriber]),
            '!moderatorViewer': new AchoBotDynamicTextCommand('!moderatorViewer', 'Command only available for moderator and viewers', 'only moderator and viewers can invoke me', [Role.Moderator, Role.Viewer]),
            '!userSubscriber': new AchoBotDynamicTextCommand('!userSubscriber', 'Command only available for specific user and subscribers', 'only specific user and subscribers can invoke me', [Role.Subscriber, 'usr:mrtest']),
        }
    }
}

export class NoPermissionsCommandsLoader implements ICommandLoader {
    async load(): Promise<TmiCommandDictionary> {

        return {
            '!everyone': new AchoBotDynamicTextCommand('!everyone', 'Command available for everyone', 'everyone can invoke me', [])
        }
    }
}

export class DynamicPermissionsCommandsLoader implements ICommandLoader {
    permissions: Permissions[];
    constructor(permissions: Permissions[]) {
        this.permissions = permissions;
    }

    async load(): Promise<TmiCommandDictionary> {

        return {
            '!dynamic': new AchoBotDynamicTextCommand('!dynamic', 'Dynamic permissions command', 'dynamic roles can invoke me', this.permissions)
        }
    }
}

