/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs';
import { Links, Admins, Groups } from './types';
import path from 'path';

const adminPath = path.resolve('./db/admins.json');
const linksPath = path.resolve('./db/links.json');
const groupsPath = path.resolve('./db/groups.json');
const checkedDatePath = path.resolve('./db/checked-date.json');

function readFileAsJson(filePath: fs.PathLike): any {
    try {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        return JSON.parse(content);
    } catch (err) {
        console.error('[ERROR]: Failed to read file as JSON!');
        return null;
    }
}

/**
 * gets all registered admins
 */
export function getAdmins(): Admins {
    return readFileAsJson(adminPath);
}

/**
 * determines whether a user is an admin
 */
export function isAdmin(userId: string): boolean {
    const userIds = Object.values(getAdmins());
    return userIds.includes(userId);
}

/**
 * gets the Links object
 */
export function getLinks(): Links {
    return readFileAsJson(linksPath);
}

/**
 * gets the all whitelisted groups
 */
export function getGroups(): Groups {
    return readFileAsJson(groupsPath);
}

/**
 * checks whether a group is registered
 */
export function isGroupRegistered(groupId: string): boolean {
    const groups = Object.values(getGroups());
    return groups.includes(groupId);
}

/**
 * checks if a date is checked (as in registered as already posted reminder)
 */
export function isDateChecked(time: string): boolean {
    const parsed: string[] = readFileAsJson(checkedDatePath);
    return parsed.includes(time);
}

/**
 * registers a date time to the checked dates (view `isDateChecked` for more info)
 */
export function checkDate(time: string): void {
    if (isDateChecked(time)) {
        return;
    }

    const parsed: string[] = readFileAsJson(checkedDatePath);
    parsed.push(time);

    fs.writeFileSync(checkedDatePath, JSON.stringify(parsed, null, 4), { encoding: 'utf8' });
}