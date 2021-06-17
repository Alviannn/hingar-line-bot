import { MessageEvent } from "@line/bot-sdk";
import * as db from '../utils/db';
import { Command } from "../utils/types";

export class LinksCommand extends Command {

    public async execute(event: MessageEvent, args: string[]): Promise<void> {
        const msg = event.message;
        const sender = event.source.userId!;

        if (msg.type !== 'text') {
            return;
        }

        if (db.isAdmin(sender)) {
            const links = db.getLinks();
            await this.client.pushMessage(sender, {
                type: 'text',
                text:
                    `------------------\n` +
                    `\n` +
                    `Absensi: ${links.absensi}\n` +
                    `Dokumentasi: ${links.dokumentasi}\n` +
                    `\n` +
                    `------------------\n`
            });
        } else {
            await this.client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'You are not qualified!'
            });
        }
    }

}