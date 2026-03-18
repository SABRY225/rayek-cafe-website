var Xhr = new XMLHttpRequest();
Xhr.open("GET", "https://server.coffee.intelakah.com/api/drinks");
Xhr.responseType = "json";
Xhr.send();

let Drinks = [];

Xhr.onload = function () {
  Drinks = Xhr.response;
  setTimeout(() => {
        document.getElementById("loader-wrapper").style.fadeOut = "slow"; 
        document.getElementById("loader-wrapper").style.display = "none";
        Displaydrinks(Drinks);
    }, 1000);
};

function Displaydrinks(drink) {
  let container = document.getElementById("DrinksContainer");
  container.innerHTML = "";

  for (let item of drink) {
    let card = document.createElement("a");
    card.className = "card";
    card.href = "./details.html?id=" + item.id;

    let imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";

    let Drinkmg = document.createElement("img");
    Drinkmg.className = "image";
    Drinkmg.src = item.image;

    let heartIcon = document.createElement("button");
    heartIcon.className = "heart-icon";
    heartIcon.innerHTML = "❤";

    let favorites = JSON.parse(localStorage.getItem("favorites"))|| [];

    let exist = favorites.find((fav) => fav.id === item.id) ;
    if (exist) {
      heartIcon.style.color = "red";
    }

    heartIcon.onclick = function (e) {
      e.preventDefault();
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      let exist = favorites.find((f) => f.id == item.id);

      if (exist) {
        favorites = favorites.filter((f) => f.id != item.id);
        heartIcon.style.color = "white"; 
      } else {
        favorites.push(item);
        heartIcon.style.color = "red";
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));

      updateBadges();
    };

    imageWrapper.append(Drinkmg, heartIcon);

    let title = document.createElement("h3");
    title.textContent = item.name;

    let description = document.createElement("p");
    description.className = "description";
    description.textContent = item.description;

    card.append(imageWrapper, title, description);
    container.append(card);
  }
}

// search
document.getElementById("searchinput").addEventListener("input", function (e) {
  let searchValue = e.target.value.toLowerCase();
  let filtered = [];

  for (let drink of Drinks) {
    if (drink.name.toLowerCase().includes(searchValue)) {
      filtered.push(drink);
    }
  }

  Displaydrinks(filtered);
});

// category filter
var Ctegory = [];

let all = document.getElementById("all");
let hotButton = document.getElementById("hot");
let coldButton = document.getElementById("cold");

all.addEventListener("click", function () {
  Ctegory = [];

  for (let drink of Drinks) {
    Ctegory.push(drink);
  }

  Displaydrinks(Ctegory);
});

hotButton.addEventListener("click", function () {
  Ctegory = [];

  for (let drink of Drinks) {
    if (drink.temperature == "ساخن") {
      Ctegory.push(drink);
    }
  }

  Displaydrinks(Ctegory);
});

coldButton.addEventListener("click", function () {
  Ctegory = [];

  for (let drink of Drinks) {
    if (drink.temperature == "بارد") {
      Ctegory.push(drink);
    }
  }

  Displaydrinks(Ctegory);
});


function updateBadges() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  document.getElementById("fav-count").textContent = favorites.length;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.length;
}

updateBadges();


document.getElementById('cartBtn').addEventListener("click", function () {
  location.href='/Pages/cart.html';
});


document.getElementById('favBtn').addEventListener("click", function () {
  location.href='/Pages/fav.html';
});
