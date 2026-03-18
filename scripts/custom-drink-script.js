const state = {
  base: { name: "إسبريسو", price: 15, color: "#3e2723" },
  milk: { name: "كامل الدسم", price: 0 },
  temp: { name: "حار", price: 0 },
  flavor: { name: "سادة", price: 0, color: "transparent" },
  extra: { name: "بدون", price: 0 },
};

function updateApp() {
  document.getElementById("sum-base").innerText = state.base.name;
  document.getElementById("sum-milk").innerText = state.milk.name;
  document.getElementById("sum-temp").innerText = state.temp.name;
  document.getElementById("sum-flavor").innerText = state.flavor.name;
  document.getElementById("sum-extra").innerText = state.extra.name;

  const total =
    state.base.price +
    state.milk.price +
    state.temp.price +
    state.flavor.price +
    state.extra.price;
  document.getElementById("total-price").innerText = `${total} ج.م`;

  const lBase = document.getElementById("layer-base");
  const lMilk = document.getElementById("layer-milk");
  const lFlavor = document.getElementById("layer-flavor");
  const lFoam = document.getElementById("layer-foam");
  const ice = document.getElementById("ice-container");

  lBase.style.backgroundColor = state.base.color;

  ice.style.display = state.temp.name.includes("بارد") ? "flex" : "none";

  if (state.milk.name === "بدون حليب") {
    lMilk.style.height = "0";
  } else {
    lMilk.style.height = "35%";
    lMilk.style.backgroundColor =
      state.flavor.name !== "سادة" && state.flavor.color !== "transparent"
        ? state.flavor.color + "80"
        : "#fffde7";
  }

  if (state.flavor.name !== "سادة") {
    lFlavor.style.height = "10px";
    lFlavor.style.backgroundColor = state.flavor.color;
  } else {
    lFlavor.style.height = "0";
  }

  if (state.extra.name === "رغوة مكثفة") {
    lFoam.style.height = "15%";
    lFoam.style.backgroundColor = "#fff";
  } else if (state.extra.name === "كريمة مخفوقة") {
    lFoam.style.height = "25%";
    lFoam.style.backgroundColor = "#fdf5e6";
  } else if (state.extra.name === "صوص شوكولاتة") {
    lFoam.style.height = "8%";
    lFoam.style.backgroundColor = "#4e2e1e";
  } else {
    lFoam.style.height = "0";
  }
}

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function () {
    const type = this.dataset.type;
    const name = this.dataset.name;
    const price = parseInt(this.dataset.price || 0);
    const color = this.dataset.color;

    if (type === "extra") {
      this.parentElement
        .querySelectorAll(".active")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
      state[type] = { name, price, color };
    } else {
      this.parentElement
        .querySelectorAll(".active")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
      state[type] = {
        name,
        price,
        color: color || (state[type] ? state[type].color : null),
      };
    }

    updateApp();
  });
});

updateApp();

document.getElementById("order-btn").addEventListener("click", function () {
  document.getElementById("orderModal").style.display = "flex";
});
document.getElementById("btn-close").addEventListener("click", function () {
  document.getElementById("orderModal").style.display = "none";
});

function calculatePrepTime() {
  let time = 2; 

  if (state.milk.name !== "بدون حليب") time += 1;

  if (state.temp.name.includes("بارد")) time += 1;

  if (state.flavor.name !== "سادة") time += 1;

  if (state.extra.name !== "بدون") time += 2;

  return time;
}

document.getElementById("btn-confirm").addEventListener("click", function () {

  const CustomerName = document.getElementById("customerName").value;
  const CustomerPhone = document.getElementById("customerPhone").value;
  if (!CustomerName || !CustomerPhone) {
    alert("يجب كتابة اسم العميل ورقم الهاتف");
    return;
  }
  const orderTime = calculatePrepTime(); 

  const total =
    state.base.price +
    state.milk.price +
    state.temp.price +
    state.flavor.price +
    state.extra.price;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://server.coffee.intelakah.com/api/orders/custom");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(
    JSON.stringify({
      name: "Custom Latte",
      quantity: 1,
      price: total,
      milk: state.milk.name,
      base: state.base.name,
      temperature: state.temp.name,
      syrup: state.extra.name,
      toppings: state.flavor.name,
      CustomerName: CustomerName,
      CustomerPhone: CustomerPhone,
      orderTime: orderTime
    })
  );

  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    alert(`طلبك سيكون جاهز خلال ${orderTime} دقائق ☕`);
    localStorage.setItem("order",JSON.stringify(data.order));
    window.location.href='../Pages/order-tracking.html'
    document.getElementById("orderModal").style.display = "none";
  };

});