import { MessageEvent } from "@line/bot-sdk";
import { Command } from "../types";

export class InfoCommand extends Command {

    public async execute(event: MessageEvent, args: string[]): Promise<void> {
        const msg = event.message;
        const source = event.source;

        if (msg.type !== 'text') {
            return;
        }

        await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text:
                'I am the official HINGAR bot! I am made by Alviannn... Arigatou!\n' +
                '\n' +
                '```\n' +
                `Group ID: ${source.type === 'group' ? source.groupId : 'none'}\n` +
                `Room ID: ${source.type === 'room' ? source.roomId : 'none'}\n` +
                `User ID: ${source.userId}\n` +
                '```\n'
        });
    }

}