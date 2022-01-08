import { AchoBotDynamicCommand } from "./achobot-dynamic.command"

export default class AchoBotDynamicTextCommand extends AchoBotDynamicCommand {
    private response: string;

    constructor(definition: string, response: string, permissions?: string[]) {
        super(definition, permissions);
        this.response = response;
    }

    protected createResponse(): string {
        return this.response;
    }
}