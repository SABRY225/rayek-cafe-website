var Xhr = new XMLHttpRequest();
Xhr.open('GET', 'https://server.coffee.intelakah.com/api/drinks');
Xhr.responseType = 'json';
Xhr.send();

let Drinks = [];

Xhr.onload = function () {
    Drinks = Xhr.response;
    Displaydrinks(Drinks);
}

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

        let heartIcon = document.createElement("div");
        heartIcon.className = "heart-icon";
        heartIcon.innerHTML = '❤';

        imageWrapper.append(Drinkmg, heartIcon);

        let title = document.createElement("h3");
        title.textContent = item.name;

        let description = document.createElement("p");
        description.className = "description";
        description.textContent = item.description;

        let priceRow = document.createElement("div");
        priceRow.className = "price-row";

        let priceTag = document.createElement("span");
        priceTag.className = "price-tag";
        priceTag.textContent = item.price + " $";

        let addBtn = document.createElement("button");
        addBtn.className = "add-btn";
        addBtn.textContent = "+";
        
        addBtn.onclick = function(e) {
            e.preventDefault();
        };

        priceRow.append(priceTag, addBtn);
        card.append(imageWrapper, title, description, priceRow);
        container.append(card);
    }
}

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


var Ctegory = [];
let all = document.getElementById("all");
let hotButton = document.getElementById("hot");
let coldButton = document.getElementById("cold");

all.addEventListener("click", function() {
    Ctegory = [];
    for (let drink of Drinks) {
        Ctegory.push(drink);
    }
    Displaydrinks(Ctegory);
});

hotButton.addEventListener("click", function() {
    Ctegory = [];
    for (let drink of Drinks) {
        if (drink.temperature == "ساخن") {
            Ctegory.push(drink);
        }
    }
    Displaydrinks(Ctegory);
});

coldButton.addEventListener("click", function() {
    Ctegory = [];
    for (let drink of Drinks) {
        if (drink.temperature == "بارد") {
            Ctegory.push(drink);
        }
    }
    Displaydrinks(Ctegory);
});