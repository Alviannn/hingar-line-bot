import { JoinEvent } from "@line/bot-sdk";
import * as db from '../utils/db';
import { BotEvent } from "../utils/types";

export class BotJoinEvent extends BotEvent {

    public async call(event: JoinEvent): Promise<void> {
        const { source } = event;

        if (source.type === 'room') {
            await this.client.leaveRoom(source.roomId);
        } else if (source.type === 'group') {
            const summary = await this.client.getGroupSummary(source.groupId);

            await this.client.pushMessage(db.getAdmins()['alvian'], {
                type: 'text',
                text:
                    'Hey! I have joined a new group!\n' +
                    '\n' +
                    '```\n' +
                    `${JSON.stringify(summary, null, 4)}\n` +
                    '```'
            });
        }
    }

}