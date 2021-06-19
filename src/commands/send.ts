import { MessageEvent } from '@line/bot-sdk';
import assert from 'assert';
import * as db from '../utils/db';
import { Command } from '../utils/types';

export class SendCommand extends Command {

    public async execute(event: MessageEvent, args: string[]): Promise<void> {
        const { source } = event;
        assert(source.type === 'group');

        const { groupId } = source;
        const groups = db.getGroups();

        if (groupId !== groups.test) {
            return;
        }

        await this.client.pushMessage(groups.test, {
            type: 'text',
            text: args.join(' ')
        });
    }

}