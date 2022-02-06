import { AchoBotDynamicCommand } from './achobot-dynamic.command';

export default class AchoBotDynamicTextCommand extends AchoBotDynamicCommand {
    private response: string;

    constructor(name: string, description: string, response: string, permissions?: string[]) {
        super(name, description, permissions);
        this.response = response;
    }

    protected createResponse(): string {
        return this.response;
    }
}