/**
 * Utility methods
 *
 * If you want to log events, errors, etc. locally during development,
 * save a boolean key/value pair: ```isDevelopmentBuild: true``` to local storage
 *
 * @module chrome/utils
 */
/** */
/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */
import * as ChromeLocale from './locales.js';
import { asyncGet } from './storage.js';
export let DEBUG = false;
asyncGet('isDevelopmentBuild', false).then((value) => {
    DEBUG = value;
});
/** Get the extension's name */
export function getExtensionName() {
    return `chrome-extension://${chrome.runtime.id}`;
}
/** Get the extension's version */
export function getVersion() {
    const manifest = chrome.runtime.getManifest();
    return manifest.version;
}
/**
 * Get the Chrome version
 * {@link http://stackoverflow.com/a/4900484/4468645}
 *
 * @returns Chrome major version
 */
export function getChromeVersion() {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : 0;
}
/**
 * Get the full Chrome version
 * {@link https://goo.gl/2ITMNO}
 *
 * @returns Chrome version
 */
export function getFullChromeVersion() {
    const raw = navigator.userAgent;
    return raw ? raw : 'Unknown';
}
/** Get the OS as a human readable string */
export async function getPlatformOS() {
    let output = 'Unknown';
    try {
        const info = await chrome.runtime.getPlatformInfo();
        const os = info.os;
        switch (os) {
            case 'win':
                output = 'MS Windows';
                break;
            case 'mac':
                output = 'Mac';
                break;
            case 'android':
                output = 'Android';
                break;
            case 'cros':
                output = 'Chrome OS';
                break;
            case 'linux':
                output = 'Linux';
                break;
            case 'openbsd':
                output = 'OpenBSD';
                break;
            default:
                break;
        }
    }
    catch (err) {
        // something went wrong - linux seems to fail this call sometimes
    }
    return output;
}
/** Determine if we are MS windows */
export async function isWindows() {
    return await isOS('win');
}
/** Determine if we are Chrome OS */
export async function isChromeOS() {
    return await isOS('cros');
}
/** Determine if we are Mac */
export async function isMac() {
    return await isOS('mac');
}
/** No operation */
export function noop() { }
/**
 * Determine if a String is null or whitespace only
 *
 * @param str - string to check
 * @returns true is str is whitespace or null
 */
export function isWhiteSpace(str) {
    return (!str || str.length === 0 || /^\s*$/.test(str));
}
/**
 * Get a random string of the given length
 *
 * @param len - length of generated string
 * @returns A pseudo-random string
 */
export function getRandomString(len = 8) {
    // noinspection SpellCheckingInspection
    const POSS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < len; i++) {
        text += POSS.charAt(Math.floor(Math.random() * POSS.length));
    }
    return text;
}
/**
 * Returns a random integer between min and max inclusive
 *
 * @param min - min value
 * @param max - max value
 * @returns A pseudo-random int
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Returns a random float between min and max inclusive min, exclusive max
 *
 * @param min - min value
 * @param max - max value
 * @returns A pseudo-random float
 */
export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * Randomly sort an Array in place
 *
 * @remarks
 *
 * Fisher-Yates shuffle algorithm.
 *
 * @param array - Array to sort
 */
export function shuffleArray(array) {
    const len = array ? array.length : 0;
    for (let i = len - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/**
 * Check for internet connection
 *
 * @remarks
 *
 * Throw an error if LAN is not connected
 *
 * This will at least ensure the LAN is connected.
 * May get false positives for other errors.
 *
 * @throws An error if no internet connection
 */
export function checkNetworkConnection() {
    if (!navigator.onLine) {
        throw new Error(ChromeLocale.localize('err_no_internet', 'Internet disconnected'));
    }
}
/**
 * Wait for the specified time
 *
 * @param time - wait time in milliSecs
 */
export async function wait(time) {
    const waiter = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await waiter(time);
}
/**
 * Determine if we are a given operating system
 *
 * @param os - os short name
 * @returns true if the given os
 */
async function isOS(os) {
    try {
        const info = await chrome.runtime.getPlatformInfo();
        return (info.os === os);
    }
    catch (err) {
        // something went wrong - linux seems to fail this call sometimes
        return false;
    }
}
