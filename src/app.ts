import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import dotenv from 'dotenv';
import express from 'express';
import { InfoCommand } from './commands/info';
import { LinksCommand } from './commands/links';
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
    handlers.registerCommand(new InfoCommand('info', ['hello'], client));
    handlers.registerCommand(new LinksCommand('links', ['link', 'url', 'docs', 'dok'], client));

    setInterval(async () => {
        console.log('[REPORT]: Reminder interval is working every 5 seconds!');

        const time = handlers.asiaTime();
        const currentDate = time.toFormat('yyyy-MM-dd HH');

        if (db.isDateChecked(currentDate)) {
            return;
        }

        console.log(`[REPORT]: Current date isn't checked -> ${currentDate}`);

        const rawText =
            `Halo teman-teman, cuma mau mengingatkan kembali jadwal HINGAR Mentoring kita ini.
            Jangan lupa ya!

            Jadwal:
            22 Mei 13:00 - 15:00
            29 Mei 13:00 - 15:00
            5 Juni 13:00 - 15:00
            12 Juni 13:00 - 15:00
            19 Juni 13:00 - 15:00
            26 Juni 13:00 - 15:00
            3 Juli 13:00 - 15:00
            10 Juli 13:00 - 15:00`.split('            ').join('');

        const message: line.Message = { type: 'text', text: rawText };
        const groupTarget = 'C2baeda158039c44064def056e6054d06';

        const { weekday, hour } = time;
        const shouldPost = (weekday === 5 && hour === 14) || (weekday === 6 && (hour === 11 || hour === 13));

        if (shouldPost) {
            await client.pushMessage(groupTarget, message);
            db.checkDate(currentDate);
        }
    }, 5_000);

    // handlers.registerEvent(new EchoMessageEvent(client, 'message'));
});