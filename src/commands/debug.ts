import { MessageEvent } from "@line/bot-sdk";
import { Command } from "../utils/types";

export class DebugCommand extends Command {

    public async execute(event: MessageEvent): Promise<void> {
        const msg = event.message;
        const source = event.source;

        if (msg.type !== 'text') {
            return;
        }

        await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text:
                // 'I am the official HINGAR bot!\n' +
                // 'So... ariga-thanks for using this bot! \n' +
                // '\n' +
                `This group ID: ${source.type === 'group' ? source.groupId : 'none'}\n` +
                `This room ID: ${source.type === 'room' ? source.roomId : 'none'}\n` +
                `Your user ID: ${source.userId}`
        });
    }

}