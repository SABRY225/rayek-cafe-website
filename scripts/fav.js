let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let container = document.getElementById("favoritesContainer");

if(favorites.length === 0){
    container.innerHTML = "<p>لا يوجد عناصر مفضلة بعد</p>";
}

for(let i = 0; i < favorites.length; i++){

    let item = favorites[i];

    let card = document.createElement("div");
    card.className = "card";

    let img = document.createElement("img");
    img.src = item.image;

    let title = document.createElement("h3");
    title.textContent = item.name;

    let price = document.createElement("p");
    price.textContent = item.price + " EGP";

    let removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "إزالة";

    removeBtn.onclick = function(){
        favorites.splice(i, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        card.remove();
        if(favorites.length === 0){
            container.innerHTML = "<p>لا يوجد عناصر مفضلة بعد</p>";
        }
    }

    card.append(img, title, price, removeBtn);
    container.append(card);
}