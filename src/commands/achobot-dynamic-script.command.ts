import { ChatUserstate } from 'tmi.js';
import { JsRunner } from '../utils/js.runner';
import Vm2Manager from '../utils/vm2.manager';
import { AchoBotDynamicCommand } from './achobot-dynamic.command';

export default class AchoBotDynamicScriptCommand extends AchoBotDynamicCommand {

    private jsRunner: JsRunner;

    constructor(name: string, description: string, response: string, permissions?: string[]) {
        super(name, description, permissions);

        this.jsRunner = new JsRunner(Vm2Manager.getInstance().vm, response);
        this.jsRunner.compile();
    }

    protected createResponse(channel: string, tags: ChatUserstate): string {

        const context: CommandContext = {
            channel: channel,
            username: tags.username
        };

        return this.jsRunner.run(context);
    }
}

type CommandContext = {
    username?: string,
    channel: string
}