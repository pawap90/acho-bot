import { AchoBotDynamicCommand } from './achobot-dynamic.command';

export default class AchoBotDynamicTextCommand extends AchoBotDynamicCommand {
    private response: string;

    constructor(response: string, permissions?: string[]) {
        super(permissions);
        this.response = response;
    }

    protected createResponse(): string {
        return this.response;
    }
}