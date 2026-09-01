/*
 * EarnPoint
 * Professional Telegram Mini App frontend
 *
 * IMPORTANT:
 * This file currently uses local/demo points.
 * Do NOT treat these client-side points as real money.
 * Later, replace reward functions with Firebase/backend
 * verification.
 */


/* =========================
   TELEGRAM
========================= */

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    // Tell Telegram the app is ready.
    if (tg.setHeaderColor) {
        tg.setHeaderColor("#08090d");
    }

    if (tg.setBackgroundColor) {
        tg.setBackgroundColor("#08090d");
    }
}


/* =========================
   USER
========================= */

const telegramUser =
    tg?.initDataUnsafe?.user || null;

let userName = "EarnPoint User";
let username = "@user";
let userId = "demo-user";

if (telegramUser) {

    userId = String(telegramUser.id);

    userName =
        telegramUser.first_name ||
        "EarnPoint User";

    if (telegramUser.username) {
        username = "@" + telegramUser.username;
    }

    document.getElementById("username").textContent =
        userName;

    document.getElementById("profileName").textContent =
        userName;

    document.getElementById("profileUsername").textContent =
        username;
}


/* =========================
   LOCAL DEMO STATE
========================= */

const STORAGE_KEY =
    "earnpoint_demo_" + userId;

let state = {
    points: 0,
    todayPoints: 0,
    totalEarned: 0,
    tasksDone: 0,
    referrals: 0,
    referralEarned: 0,
    dailyClaimed: false
};

try {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (saved) {
        state = {
            ...state,
            ...JSON.parse(saved)
        };
    }

} catch (error) {
    console.log("Local state unavailable");
}


/* =========================
   SAVE
========================= */

function saveState() {

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );
    } catch (error) {
        console.log("Could not save local state");
    }
}


/* =========================
   UI UPDATE
========================= */

function updateUI() {

    const points =
        Number(state.points) || 0;

    const cash =
        points / 1000 * 5;

    document.getElementById("points").textContent =
        points.toLocaleString();

    document.getElementById("cashValue").textContent =
        "≈ ₹" + cash.toFixed(2);

    document.getElementById("todayPoints").textContent =
        "+" + state.todayPoints.toLocaleString();

    document.getElementById("totalEarned").textContent =
        state.totalEarned.toLocaleString();

    document.getElementById("tasksDone").textContent =
        state.tasksDone.toLocaleString();

    document.getElementById("referrals").textContent =
        state.referrals.toLocaleString();

    document.getElementById("walletPoints").textContent =
        points.toLocaleString();

    document.getElementById("walletCash").textContent =
        "≈ ₹" + cash.toFixed(2);

    document.getElementById("referralCount").textContent =
        state.referrals.toLocaleString();

    document.getElementById("referralEarned").textContent =
        state.referralEarned.toLocaleString();


    const dailyButton =
        document.getElementById("dailyButton");

    if (state.dailyClaimed) {

        dailyButton.textContent =
            "Claimed";

        dailyButton.classList.add("claimed");

    } else {

        dailyButton.textContent =
            "+10";

        dailyButton.classList.remove("claimed");
    }


    createReferralCode();
}


/* =========================
   ADD POINTS
========================= */

function addDemoPoints(amount, reason) {

    amount = Number(amount);

    if (!Number.isFinite(amount) ||
        amount <= 0) {
        return;
    }

    state.points += amount;
    state.todayPoints += amount;
    state.totalEarned += amount;
    state.tasksDone += 1;

    saveState();
    updateUI();

    showToast(
        "✓",
        "+" + amount + " points • " + reason
    );
}


/* =========================
   DAILY BONUS
========================= */

function claimDaily() {

    if (state.dailyClaimed) {

        showToast(
            "✓",
            "Daily reward already claimed"
        );

        return;
    }

    state.dailyClaimed = true;

    addDemoPoints(
        10,
        "Daily bonus"
    );
}


/* =========================
   WATCH AD
========================= */

function watchAd() {

    /*
     * REAL AD INTEGRATION GOES HERE.
     *
     * Do not award points simply because
     * this button was clicked.
     *
     * Later:
     *
     * 1. Open the approved rewarded-ad SDK.
     * 2. Wait for its completion callback.
     * 3. Send the completion proof/event
     *    to your backend.
     * 4. Backend verifies the reward.
     * 5. Backend updates Firestore.
     */

    showToast(
        "📺",
        "Rewarded ads will be connected here"
    );
}


/* =========================
   CHANNEL TASK
========================= */

function joinChannel() {

    const channelURL =
        "https://t.me/YOUR_CHANNEL";

    if (tg?.openTelegramLink) {

        tg.openTelegramLink(
            channelURL
        );

    } else {

        window.open(
            channelURL,
            "_blank"
        );
    }

    showToast(
        "📢",
        "Join the channel, then return to verify"
    );
}


/* =========================
   REFERRAL
========================= */

function createReferralCode() {

    const code =
        userId === "demo-user"
            ? "demo"
            : userId;

    document.getElementById("refCode").textContent =
        "Referral ID: " + code;
}


function getReferralLink() {

    /*
     * Replace YOUR_BOT_USERNAME with
     * your actual bot username.
     */

    const botUsername =
        "YOUR_BOT_USERNAME";

    return (
        "https://t.me/" +
        botUsername +
        "?startapp=ref_" +
        encodeURIComponent(userId)
    );
}


function shareReferral() {

    const link =
        getReferralLink();

    const shareURL =
        "https://t.me/share/url?url=" +
        encodeURIComponent(link) +
        "&text=" +
        encodeURIComponent(
            "Join EarnPoint and start earning points!"
        );

    if (tg?.openTelegramLink) {

        tg.openTelegramLink(
            shareURL
        );

    } else {

        window.open(
            shareURL,
            "_blank"
        );
    }
}


/* =========================
   MINI GAME
========================= */

let gameRunning = false;
let gameScore = 0;
let gameTimer = null;
let gameSeconds = 10;

function startGame() {

    if (gameRunning) {

        gameScore++;

        document.getElementById("gameScore")
            .textContent = gameScore;

        return;
    }

    gameRunning = true;
    gameScore = 0;
    gameSeconds = 10;

    const button =
        document.getElementById("gameButton");

    const status =
        document.getElementById("gameStatus");

    document.getElementById("gameScore")
        .textContent = "0";

    button.textContent =
        "TAP!";

    status.textContent =
        "10 seconds remaining";

    gameTimer =
        setInterval(() => {

            gameSeconds--;

            status.textContent =
                gameSeconds +
                " seconds remaining";

            if (gameSeconds <= 0) {

                clearInterval(gameTimer);

                gameRunning = false;

                button.textContent =
                    "Start Game";

                status.textContent =
                    "Finished • " +
                    gameScore +
                    " taps";

                /*
                 * DEMO ONLY.
                 *
                 * Real games should validate
                 * scores server-side.
                 */

                const reward =
                    Math.min(
                        Math.max(
                            Math.floor(gameScore / 5),
                            1
                        ),
                        10
                    );

                addDemoPoints(
                    reward,
                    "Game reward"
                );
            }

        }, 1000);
}


/* =========================
   NAVIGATION
========================= */

function openPage(page) {

    const pages = [
        "home",
        "earn",
        "tasks",
        "refer",
        "games",
        "wallet",
        "profile"
    ];

    pages.forEach(name => {

        const element =
            document.getElementById(
                name + "Page"
            );

        if (element) {

            element.classList.toggle(
                "active",
                name === page
            );
        }
    });


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   NOTIFICATIONS
========================= */

function showNotifications() {

    showInfo(
        "Notifications",
        "You're all caught up. New task notifications will appear here."
    );
}


/* =========================
   WALLET
========================= */

function showWithdrawInfo() {

    showInfo(
        "Withdraw",
        "Withdrawal will be enabled after the reward system and eligibility rules are configured."
    );
}


/* =========================
   INFO DIALOG
========================= */

function showInfo(title, message) {

    if (tg?.showPopup) {

        tg.showPopup({
            title: title,
            message: message,
            buttons: [
                {
                    type: "ok"
                }
            ]
        });

        return;
    }

    alert(
        title + "\n\n" + message
    );
}


/* =========================
   TOAST
========================= */

let toastTimer = null;

function showToast(icon, message) {

    const toast =
        document.getElementById("toast");

    document.getElementById("toastIcon")
        .textContent = icon;

    document.getElementById("toastText")
        .textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2400);
}


/* =========================
   START
========================= */

updateUI();


// Telegram back button
if (tg?.BackButton) {

    tg.BackButton.onClick(() => {

        openPage("home");

        tg.BackButton.hide();
    });
}
