const order = JSON.parse(localStorage.getItem('order'));

document.getElementById("orderId").innerText = "#" + order.id;
document.getElementById("orderTime").innerText = order.orderTime + " دقائق";

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let totalTime = parseFloat(order.orderTime) * 60;
let currentTime = totalTime;
let typeOrder = order.type;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
}

function sendOrderFinished() {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `https://server.coffee.intelakah.com/api/orders/${order.id}/status`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log("Response:", xhr.responseText);
        }
    };

    const data = JSON.stringify({
        type:typeOrder,
        status: "completed"
    });

    xhr.send(data);
}

const timer = setInterval(() => {
if (currentTime <= 0) {
    clearInterval(timer);

    sendOrderFinished();

    document.getElementById("readyMessage").style.display = "block";
    document.getElementById("timer-container").style.display = "none";

    return;
}
    currentTime--;

    const mins = Math.floor(currentTime / 60);
    const secs = currentTime % 60;

    document.getElementById('minutes').textContent =
        mins.toString().padStart(2, '0');

    document.getElementById('seconds').textContent =
        secs.toString().padStart(2, '0');

    const percent = (currentTime / totalTime) * 100;
    setProgress(percent);

}, 1000);

setProgress(100);