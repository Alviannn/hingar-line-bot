import * as line from '@line/bot-sdk';
import { WebhookEvent, Client } from '@line/bot-sdk';
import { BotEvent, Command } from './types';

const events: BotEvent[] = [];
const commands: Map<string, Command> = new Map();

class CommandEvent extends BotEvent {

    public async call(event: WebhookEvent): Promise<void> {
        event = event as line.MessageEvent;

        if (event.message.type !== 'text') {
            return;
        }

        const { message: msg } = event;
        const { text } = msg;

        const args = text.split(' ');
        const prefix = args.shift()!.toLowerCase();

        if (args.length < 1 || prefix !== 'hingar') {
            return;
        }

        const subcmd = args.shift()!.toLowerCase();
        const cmdList = new Array(...commands.values());

        const currcmd = cmdList.find((cmd) => {
            if (cmd.name === subcmd || cmd.aliases.includes(subcmd)) {
                return cmd;
            }
        });

        if (currcmd) {
            await currcmd.execute(event, args);
        }
    }

}

export function registerCommand(cmd: Command): void {
    commands.set(cmd.name, cmd);
    console.log(`[Handler]: Registered command ${cmd.name}`);
}

export function registerEvent(event: BotEvent): void {
    events.push(event);
}

export function registerCommandEvent(client: Client): void {
    registerEvent(new CommandEvent(client, 'message'));
}

export async function handleEvent(event: WebhookEvent): Promise<void> {
    events.filter((be) => be.type === event.type)
        .map(async (be) => await be.call(event));
}