/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs';
import { Links, Admins, Groups } from './types';
import path from 'path';

const adminPath = path.resolve('./db/admins.json');
const linksPath = path.resolve('./db/links.json');
const groupsPath = path.resolve('./db/groups.json');
const checkedDatePath = path.resolve('./db/checked-date.json');

/**
 * gets all registered admins
 */
export function getAdmins(): Admins {
    return require(adminPath);
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
    return require(linksPath);
}

/**
 * gets the all whitelisted groups
 */
export function getGroups(): Groups {
    return require(groupsPath);
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
    const parsed: string[] = require(checkedDatePath);
    return parsed.includes(time);
}

/**
 * registers a date time to the checked dates (view `isDateChecked` for more info)
 */
export function checkDate(time: string): void {
    if (isDateChecked(time)) {
        return;
    }

    const parsed: string[] = require(checkedDatePath);
    parsed.push(time);

    fs.writeFileSync(checkedDatePath, JSON.stringify(parsed, null, 4), { encoding: 'utf8' });
}