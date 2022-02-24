import { ChatUserstate } from 'tmi.js';
import { JsRunner } from '../utils/js.runner';
import Vm2Manager from '../utils/vm2.manager';
import { AchoBotDynamicCommand } from './achobot-dynamic.command';

export type CommandParams = { [key: string]: string };

export default class AchoBotDynamicScriptCommand extends AchoBotDynamicCommand {

    private jsRunner: JsRunner;

    constructor(name: string, description: string, response: string, permissions?: string[]) {
        super(name, description, permissions);

        this.jsRunner = new JsRunner(Vm2Manager.getInstance().vm, response);
        this.jsRunner.compile();
    }

    protected createResponse(channel: string, tags: ChatUserstate, message: string): string {
        const context: CommandContext = {
            channel: channel,
            username: tags.username,
            params: this.getCommandParams(message),
        };

        return this.jsRunner.run(context);
    }

    private getCommandParams(message: string): CommandParams {
        const params: CommandParams = {};
        const commands = this.name.split(' ').slice(1);
        const args = message.split(' ').slice(1);

        commands.forEach((command, index) => {
            command = command.replace(/<|>/g, '');
            params[command] = args[index];
        });

        return params;
    }
}

type CommandContext = {
    channel: string,
    username?: string,
    params?: CommandParams
}