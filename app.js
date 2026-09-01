let points = 0;

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;

if (user) {
    document.getElementById("username").textContent =
        "Hi, " + (user.first_name || "there") + " 👋";
}

function updateBalance() {
    document.getElementById("points").textContent =
        points.toLocaleString();

    const rupees = points / 1000 * 5;

    document.getElementById("rupees").textContent =
        "≈ ₹" + rupees.toFixed(2);
}

function addPoints(amount) {
    points += amount;
    updateBalance();
}

function loginReward() {
    addPoints(10);
    tg.showAlert("🎉 Daily login reward: +10 points");
}

function watchAd() {
    tg.showAlert(
        "📺 Demo ad\n\nThe real rewarded ad will be connected later."
    );
}

function joinChannel() {
    tg.showAlert(
        "📢 Channel verification will be connected later."
    );
}

function inviteFriends() {
    const botUsername = "YOUR_BOT_USERNAME";

    const link =
        "https://t.me/" +
        botUsername +
        "?start=ref_" +
        (user?.id || "");

    tg.showPopup({
        title: "Invite Friends",
        message: "Share your referral link with friends.",
        buttons: [
            {
                id: "share",
                type: "default",
                text: "Share"
            },
            {
                type: "cancel"
            }
        ]
    }, function(id) {

        if (id === "share") {
            tg.openTelegramLink(
                "https://t.me/share/url?url=" +
                encodeURIComponent(link)
            );
        }

    });
}

function playGame() {
    addPoints(1);
    tg.showAlert("🎮 Game reward: +1 point");
}

updateBalance();