import fs from 'fs';
import { Links } from './types';

const adminFilePath = './db/admins.json';
const linksFilePath = './db/links.json';
const groupsFilePath = './db/groups.json';

/**
 * gets all registered admins
 */
export function getAdmins(): string[] {
    const content = fs.readFileSync(adminFilePath, { encoding: 'utf8' });

    try {
        return JSON.parse(content);
    } catch (err) {
        return [];
    }
}

/**
 * determines whether a user is an admin
 */
export function isAdmin(userId: string): boolean {
    return getAdmins().includes(userId);
}

/**
 * registers a user as an admin
 */
export function registerAdmin(userId: string): void {
    const admins = getAdmins();
    if (admins.includes(userId)) {
        return;
    }

    admins.push(userId);
    fs.writeFileSync(adminFilePath, JSON.stringify(admins), { encoding: 'utf8' });
}

/**
 * gets the {@link Links} object
 */
export function getLinks(): Links {
    const content = fs.readFileSync(linksFilePath, { encoding: 'utf8' });
    return JSON.parse(content);
}

/**
 * gets the all whitelisted groups
 */
export function getGroups(): string[] {
    const content = fs.readFileSync(groupsFilePath, { encoding: 'utf8' });
    return JSON.parse(content);
}