import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import dotenv from 'dotenv';
import express from 'express';
import { DebugCommand } from './commands/debug';
import { LinksCommand } from './commands/links';
import { BotJoinEvent } from './events/join';
import { ReceiveMessageEvent } from './events/message';
import * as db from './utils/db';
import * as handlers from './utils/handlers';

dotenv.config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.CHANNEL_SECRET!
};

const client = new line.Client(config);
const app = express();

app.get('/', async (_, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!'
    });
});

app.post('/webhook', line.middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;
    const results = await Promise.all(
        events.map(async (event) => {
            try {
                await handlers.handleEvent(event);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err);
                }

                return res.status(500).json({ status: 'An error has occurred!' });
            }
        })
    );

    return res.status(200).json({
        status: 'success',
        results
    });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Bot is live at port ${port}`);

    handlers.registerCommandEvent(client);
    handlers.registerCommand(new DebugCommand('debug', [], client));
    handlers.registerCommand(new LinksCommand('links', ['link', 'url', 'docs', 'doc', 'dokumentasi', 'dok', 'absensi', 'absen'], client));

    handlers.registerEvent(new BotJoinEvent(client, 'join'));
    handlers.registerEvent(new ReceiveMessageEvent(client, 'message'));

    setInterval(async () => {
        console.log('[REPORT]: Reminder is still running!');

        const time = handlers.asiaTime();
        const currentDate = time.toFormat('yyyy-MM-dd HH');

        if (db.isDateChecked(currentDate)) {
            return;
        }

        const messages = {
            notToday:
                `Halo teman-teman, cuma mau mengingatkan kembali jadwal HINGAR Mentoring.
                Jangan lupa ya!

                Jadwal:
                22 Mei 13:00 - 15:00
                29 Mei 13:00 - 15:00
                5 Juni 13:00 - 15:00
                12 Juni 13:00 - 15:00
                19 Juni 13:00 - 15:00
                26 Juni 13:00 - 15:00
                3 Juli 13:00 - 15:00
                10 Juli 13:00 - 15:00`.split('                ').join(''),
            today:
                `Halo teman-teman HINGAR, cuma mau mengingatkan kembali jadwal HINGAR Mentoring kita hari ini jam 13:00 - 15:00.
                So..., Jangan lupa ya!

                Jadwal-Lengkap:
                22 Mei 13:00 - 15:00
                29 Mei 13:00 - 15:00
                5 Juni 13:00 - 15:00
                12 Juni 13:00 - 15:00
                19 Juni 13:00 - 15:00
                26 Juni 13:00 - 15:00
                3 Juli 13:00 - 15:00
                10 Juli 13:00 - 15:00`.split('                ').join('')
        };

        const { weekday, hour } = time;
        const shouldPost = (weekday === 5 && hour === 14) || (weekday === 6 && (hour === 11 || hour === 13));

        if (shouldPost) {
            const message: line.Message = {
                type: 'text',
                text: weekday === 6 ? messages.today : messages.notToday
            };

            const target = db.getGroups()['public'];

            await client.pushMessage(target, message);
            db.checkDate(currentDate);
        }
    }, 30_000);
});