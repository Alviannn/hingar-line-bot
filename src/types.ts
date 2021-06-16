import { Client, MessageEvent, WebhookEvent } from '@line/bot-sdk';

export type EventTypes = "message" | "unsend" | "follow" | "unfollow" | "join" | "leave" | "memberJoined" | "memberLeft" | "postback" | "videoPlayComplete" | "beacon" | "accountLink" | "things";

export abstract class BotEvent {

    public readonly client: Client;
    public readonly type: EventTypes;

    public constructor(client: Client, type: EventTypes) {
        this.client = client;
        this.type = type;
    }

    public abstract call(event: WebhookEvent): Promise<void>;

}

export abstract class Command {

    public readonly name: string;
    public readonly aliases: string[];
    public readonly client: Client;

    public constructor(name: string, aliases: string[], client: Client) {
        this.name = name;
        this.aliases = aliases || [];
        this.client = client;
    }

    public abstract execute(event: MessageEvent, args: string[]): Promise<void>;

}