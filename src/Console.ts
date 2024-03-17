import { Platform } from "obsidian";

let DEBUG = "false";

if (Platform.isDesktopApp) {
    require('dotenv').config();
    DEBUG = process.env.DEBUG ?? "false";
}

export const Console = {
    debug: (...args: any[]) => {
        if (DEBUG.trim().toLowerCase() === "true") {
            console.debug(...args);
        }
    },
    log: (...args: any[]) => {
        if (DEBUG.trim().toLowerCase() === "true") {
            console.log(...args);
        }
    }
};