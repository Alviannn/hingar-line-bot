import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';

import dotenv from 'dotenv';
import express from 'express';
import got from 'got';

import * as handlers from './handlers';
import { InfoCommand } from './commands/info';
import { LinksCommand } from './commands/links';

dotenv.config();

// todo:
//  - 1. Jadwal jum'at (jam 2) dan sabtu (jam 11 dan 1)
//  - 2. Provide link dokumentasi

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

async function keepAlive() {
    const link = `127.0.0.1:${port}`;
    try {
        await got.get(link, { headers: { 'user-agent': 'Mozilla/5.0' } });
        console.log('[Status]: is alive and well...');
    } catch (err) {
        console.log('[Status]: Failed to keep alive the server!!');
    }
}

app.listen(port, () => {
    console.log(`Bot is live at port ${port}`);

    handlers.registerCommandEvent(client);
    handlers.registerCommand(new InfoCommand('info', ['hello'], client));
    handlers.registerCommand(new LinksCommand('links', ['link', 'url', 'docs', 'dok'], client));
    // handlers.registerEvent(new EchoMessageEvent(client, 'message'));

    setInterval(keepAlive, 5 * 60 * 1000);
});