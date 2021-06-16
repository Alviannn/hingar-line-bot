import { MessageEvent } from "@line/bot-sdk";
import { Command } from "../types";

export class LinksCommand extends Command {

    public async execute(event: MessageEvent, args: string[]): Promise<void> {
        const msg = event.message;
        if (msg.type !== 'text') {
            return;
        }

        await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Not done yet...'
        });
    }

}