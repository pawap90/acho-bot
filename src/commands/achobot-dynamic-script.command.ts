import { ChatUserstate } from "tmi.js";
import { JsRunner } from "../utils/js.runner";
import Vm2Manager from "../utils/vm2.manager";
import { AchoBotDynamicCommand, CommandParams } from "./achobot-dynamic.command"

export default class AchoBotDynamicScriptCommand extends AchoBotDynamicCommand {

    private jsRunner: JsRunner;

    constructor(definition: string, response: string, permissions?: string[]) {
        super(definition, permissions);

        this.jsRunner = new JsRunner(Vm2Manager.getInstance().vm, response);
        this.jsRunner.compile();
    }

    protected createResponse(channel: string, tags: ChatUserstate, params: CommandParams): string {

        const context: CommandContext = {
            params,
            channel: channel,
            username: tags.username
        };

        return this.jsRunner.run(context);
    }
}

type CommandContext = {
    params: CommandParams,
    username?: string,
    channel: string
}