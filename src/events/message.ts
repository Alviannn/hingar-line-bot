import { MessageEvent } from '@line/bot-sdk';
import { BotEvent } from '../utils/types';
import * as db from '../utils/db';

export class ReceiveMessageEvent extends BotEvent {

    public async call(event: MessageEvent): Promise<void> {
        const { source } = event;

        switch (source.type) {
            case 'group': {
                const { groupId } = source;

                if (!db.isGroupRegistered(groupId)) {
                    await this.client.leaveGroup(groupId);
                }

                break;
            }
            case 'room': {
                const { roomId } = source;
                await this.client.leaveRoom(roomId);

                break;
            }
        }
    }

}