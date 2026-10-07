const DiscordRPC = require("discord-rpc");
const fs = require("fs");
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "settings.json");
const SAVE_FILE = path.join(__dirname, "backuptime.json");

let settings;

try {
    if (!fs.existsSync(SETTINGS_FILE)) {
        console.error("Khong tim thay settings.json!");
        process.exit(1);
    }

    settings = JSON.parse(
        fs.readFileSync(SETTINGS_FILE, "utf8")
    );

} catch (error) {
    console.error("Khong doc duoc settings.json:");
    console.error(error);
    process.exit(1);
}

const CLIENT_ID = settings.clientId;

if (!CLIENT_ID || CLIENT_ID === "ID_BOT") {
    console.error("CLIENT_ID chua duoc cai dat trong settings.json!");
    process.exit(1);
}

let savedTime = 0;
const sessionStart = Date.now();

if (fs.existsSync(SAVE_FILE)) {
    try {
        const data = JSON.parse(
            fs.readFileSync(SAVE_FILE, "utf8")
        );

        const hours = data.hours || 0;
        const minutes = data.minutes || 0;
        const seconds = data.seconds || 0;

        savedTime =
            hours * 60 * 60 * 1000 +
            minutes * 60 * 1000 +
            seconds * 1000;

        console.log(
            `thoi gian cu: ${hours} gio ${minutes} phut ${seconds} giay`
        );

    } catch (error) {
        console.log("Khong doc duoc backuptime.json, bat dau tu 0.");
        savedTime = 0;
    }
}

function saveTime() {

    const currentSession = Date.now() - sessionStart;
    const totalTime = savedTime + currentSession;

    const totalSeconds = Math.floor(totalTime / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const data = JSON.stringify(
        {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        },
        null,
        4
    );

    const TEMP_FILE = SAVE_FILE + ".tmp";

    try {

        fs.writeFileSync(
            TEMP_FILE,
            data,
            "utf8"
        );

        fs.renameSync(
            TEMP_FILE,
            SAVE_FILE
        );

    } catch (error) {

        console.error(
            "Khong luu duoc thoi gian:",
            error
        );
    }
}

DiscordRPC.register(CLIENT_ID);

let rpc;
let connecting = false;
let reconnectTimer = null;

function connectDiscord() {

    if (connecting || reconnectTimer) {
        return;
    }

    connecting = true;

    rpc = new DiscordRPC.Client({
        transport: "ipc"
    });

    rpc.on("ready", async () => {

        connecting = false;

        console.log("discord rich presence online!");

        try {

            const activity = {

                type: 0,

                details:
                    settings.details || "",

                state:
                    settings.state || "",

                startTimestamp:
                    Date.now() - savedTime
            };


            if (
                settings.button &&
                settings.button.label &&
                settings.button.url
            ) {

                activity.buttons = [
                    {
                        label: settings.button.label,
                        url: settings.button.url
                    }
                ];
            }

            await rpc.setActivity(activity);

            console.log(
                "discord rich presence online!"
            );

        } catch (error) {

            console.error(
                "error rich presence:",
                error
            );
        }
    });

    rpc.on("disconnected", () => {

        connecting = false;

        reconnectDiscord();
    });

    rpc.login({
        clientId: CLIENT_ID
    }).catch(() => {

        connecting = false;

        reconnectDiscord();
    });
}

function reconnectDiscord() {

    if (reconnectTimer) {
        return;
    }

    reconnectTimer = setTimeout(() => {

        reconnectTimer = null;

        connectDiscord();

    }, 30000);
}

setInterval(saveTime, 30000);

process.on("SIGINT", () => {

    saveTime();

    process.exit();
});

process.on("SIGTERM", () => {

    saveTime();

    process.exit();
});

connectDiscord();
