import * as line from '@line/bot-sdk';
import { Client, WebhookEvent } from '@line/bot-sdk';
import * as db from '../utils/db';
import { BotEvent, Command } from './types';
import { DateTime } from 'luxon';

const events: BotEvent[] = [];
const commands: Command[] = [];

/**
 * The event handler for command executions
 */
class CommandEvent extends BotEvent {

    public async call(event: WebhookEvent): Promise<void> {
        event = event as line.MessageEvent;

        if (event.message.type !== 'text') {
            return;
        }

        const { message: msg, source } = event;
        const { text } = msg;

        // commands can only be executed in groups
        if (source.type !== 'group') {
            return;
        }
        // prevents from executing to a non-whitelisted groups
        if (!db.getGroups().includes(source.groupId)) {
            return;
        }

        const args = text.split(' ');
        const prefix = args.shift()!.toLowerCase();

        if (args.length < 1 || prefix !== 'hingar') {
            return;
        }

        const subcmd = args.shift()!.toLowerCase();
        const currcmd = commands.find((cmd) => {
            if (cmd.name === subcmd || cmd.aliases.includes(subcmd)) {
                return cmd;
            }
        });

        if (currcmd) {
            await currcmd.execute(event, args);
        }
    }

}

/**
 * registers a command to the bot
 */
export function registerCommand(cmd: Command): void {
    commands.push(cmd);
    console.log(`[Handler]: Registered command ${cmd.name}`);
}

/**
 * registers an event to the bot
 */
export function registerEvent(event: BotEvent): void {
    events.push(event);
}

/**
 * registers the command event to the bot
 */
export function registerCommandEvent(client: Client): void {
    registerEvent(new CommandEvent(client, 'message'));
}

/**
 * handles all incoming events from the LINE webhook receiver
 */
export async function handleEvent(event: WebhookEvent): Promise<void> {
    events
        .filter((ev) => ev.type === event.type)
        .map(async (ev) => await ev.call(event));
}

/**
 * gets the current asian time
 */
export function asiaTime(): DateTime {
    return DateTime.utc().setZone('Asia/Bangkok', { keepLocalTime: false });
}