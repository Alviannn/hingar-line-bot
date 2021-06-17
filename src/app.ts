import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import dotenv from 'dotenv';
import express from 'express';
import { InfoCommand } from './commands/info';
import { LinksCommand } from './commands/links';
import * as handlers from './utils/handlers';
import * as db from './utils/db';

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
        const time = handlers.asiaTime();
        const currentDate = time.toFormat('yyyy-MM-dd');

        if (db.isDateChecked(currentDate)) {
            return;
        }

        if (time.weekday === 5 && time.hour === 14) {
            // todo: post reminder
        } else if (time.weekday === 6 && (time.hour === 11 || time.hour === 13)) {
            // todo: post reminder
        }
    }, 5_000);

    // handlers.registerEvent(new EchoMessageEvent(client, 'message'));
});