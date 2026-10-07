
const DiscordRPC = require("discord-rpc");
const fs = require("fs");
const path = require("path");
// CẦN CHỈNH PHẦN PHÍA DƯỚI
// -------------------------------------------------CẦN CHỈNH PHẦN PHÍA DƯỚI
// ok
const CLIENT_ID = "ID_BOT"; // id con bot vô 
// ok
// -------------------------------------------------CẦN CHỈNH PHẦN PHÍA TRÊN
// CẦN CHỈNH PHẦN PHÍA TRÊN
const SAVE_FILE = path.join(__dirname, "backuptime.json");

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
            `thoi gian cu~: ${hours} gio ${minutes} phut ${seconds} giay`
        );
    } catch (error) {
        console.log("deo doc duoc setting time, bat dau tu 0.");
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
        fs.writeFileSync(TEMP_FILE, data, "utf8");

        fs.renameSync(TEMP_FILE, SAVE_FILE);

    } catch (error) {
        console.error("deo luu duoc thoi gian:", error);
    }
}

DiscordRPC.register(CLIENT_ID);

let rpc;
let connecting = false;
let reconnectTimer = null;

function connectDiscord() {
    if (connecting || reconnectTimer) return;

    connecting = true;

    rpc = new DiscordRPC.Client({
        transport: "ipc"
    });

    rpc.on("ready", async () => {
        connecting = false;

        console.log("discord rich presence online!");
// --------------------------------------------------CẦN CHỈNH PHẦN PHÍA DƯỚI
// -------------------------CẦN CHỈNH PHẦN PHÍA DƯỚI
// ---------------------------------------------------------------------------------------CẦN CHỈNH PHẦN PHÍA DƯỚI
        try {
            await rpc.setActivity({
                type: 0,
                details: "TEXTGH",     // chữ   
                state: "TEXTALPHA",        // chữ        

                startTimestamp: Date.now() - savedTime,

                buttons: [
                    {
                        label: "text",      // cái nút hiện chữ
                        url: "bắt buộc là url hoặc không cần thì chỉ cần điền trống label và url"    // bắt buộc là url hoặc không cần thì chỉ cần điền trống label và url
                    }
                ]
            });
// CẦN CHỈNH PHẦN PHÍA TRÊN
// ------------------------CẦN CHỈNH PHẦN PHÍA TRÊN
// -------------------------------------------------CẦN CHỈNH PHẦN PHÍA TRÊN
// --------------------------------------------------------------------------CẦN CHỈNH PHẦN PHÍA TRÊN
            console.log("discord rich presence online!");
        } catch (error) {
            console.error("eror rich presence:", error);
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
    if (reconnectTimer) return;

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