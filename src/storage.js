/**
 * Manage items in storage
 *
 * @module chrome/storage
 */
/** */
/*
 * Copyright (c) 2015-2019, Michael A. Updike All rights reserved.
 * Licensed under the BSD-3-Clause
 * https://opensource.org/licenses/BSD-3-Clause
 * https://github.com/opus1269/chrome-ext-utils/blob/master/LICENSE
 */
import * as ChromeGA from './analytics.js';
import * as ChromeMsg from './msg.js';
/**
 * Get a value from chrome.storage.local
 *
 * {@link  https://developer.chrome.com/apps/storage}
 *
 * @param key - data key
 * @param def - optional default value if not found
 * @returns value from storage, null if not found unless default is provided
 */
export async function asyncGet(key, def) {
    let value = null;
    try {
        const res = await chrome.storage.local.get([key]);
        value = res[key];
    }
    catch (err) {
        ChromeGA.error(err.message, 'ChromeStorage.asyncGet');
        if (def !== undefined) {
            value = def;
        }
    }
    if (value === undefined) {
        // probably not in storage
        if (def !== undefined) {
            value = def;
        }
    }
    return value;
}
/**
 * Save a value to chrome.storage.local only if there is enough room
 *
 * {@link  https://developer.chrome.com/apps/storage}
 *
 * @param key - data key
 * @param value - data value
 * @param keyBool - optional key to a boolean value that is true if the primary key has non-empty value
 * @returns true if value was set successfully
 */
export async function asyncSet(key, value, keyBool) {
    // TODO what about keyBool?
    let ret = true;
    const obj = {
        [key]: value,
    };
    try {
        await chrome.storage.local.set(obj);
    }
    catch (err) {
        // notify listeners save failed
        ChromeMsg.send(ChromeMsg.TYPE.STORAGE_EXCEEDED).catch(() => { });
        ret = false;
    }
    return ret;
}
// const oldValue = get(key);
// try {
//   set(key, value);
// } catch (e) {
//   ret = false;
//   if (oldValue) {
//     // revert to old value
//     set(key, oldValue);
//   }
//   if (keyBool) {
//     // revert to old value
//     if (oldValue && oldValue.length) {
//       set(keyBool, true);
//     } else {
//       set(keyBool, false);
//     }
//   }
//   // notify listeners
//   ChromeMsg.send(ChromeMsg.TYPE.STORAGE_EXCEEDED).catch(() => {});
// }
// return ret;
