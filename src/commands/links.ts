import { MessageEvent } from "@line/bot-sdk";
import assert from "assert";
import * as db from '../utils/db';
import { Command } from "../utils/types";

export class LinksCommand extends Command {

    public async execute(event: MessageEvent): Promise<void> {
        const { message: msg, source } = event;

        if (msg.type !== 'text') {
            return;
        }

        assert(source.type === 'group');
        const { groupId } = source;

        if (db.getGroups().panitia === groupId) {
            const { absensi, dokumentasi } = db.getLinks();
            await this.client.replyMessage(event.replyToken, {
                type: 'text',
                text:
                    `------------------\n` +
                    `\n` +
                    `Absensi: ${absensi}\n` +
                    `Dokumentasi: ${dokumentasi}\n` +
                    `\n` +
                    `------------------\n`
            });
        } else {
            await this.client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'This group is not qualified for that command!'
            });
        }
    }

}