let cartContiner = document.getElementById('cartItems');
let itemsList = document.getElementById('itemsList');
let totalPrice = document.getElementById('totalPrice');
let noOfitems = document.getElementById('noOfitems');

let cartProducts = [];

// check if data avliabel in local if not store it 

if (localStorage.getItem('cartProducts') === null) {
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
} else {
    cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
}

// reset local filter to null every time page loads

localStorage.setItem("localFilter", "");

// set local_filter filtered search on user page on button click

let setlocalFilter = (val) => {
    localStorage.setItem("localFilter", val);
}

// remove product from cart

let removeCartItem = (id) => {
    let index = cartProducts.findIndex((product) => product.id === id)
    cartProducts.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    window.alert('Item removed');
    displayCartitems(cartProducts);
}


// cart items display function

let displayCartitems = (data) => {
    let cartString = '';
    let itemsString = '';
    let totalPriceINR = 0;
    let cartItemsTotal = data.length;

    data.forEach(function(element, index) {
        const { id, name, price, category, color, rating, imgUrl, numofrating } = element;
        cartString += `<div class="product-one">
            <div class="product-img-one">
                <img src="${imgUrl}" alt="">
            </div>
            <div class="product-details-one">
                <h2>${name}</h2>
                <br>
                <div style="display: flex;">
                    <h4 class='product-price'>₹ ${Number(price).toLocaleString()}</h4>
                    <div class="color-div">
                        <div>Color:</div>
                        <div class='productColor' style='background-color:${color}'>
                        </div>
                    </div>
                </div>
                <button class="btn" onclick = "removeCartItem('${id}')">Delete</button>
                <button class="btn">
                    <a href="user.html" onclick ="setlocalFilter('${category}')" target="">See More Like This</a>
                </button>
            </div>
        </div>
        <span class="line"></span>`;

        itemsString += ` <br> <li>${name}</li>`;
        totalPriceINR += Number(price);
    });

    cartContiner.innerHTML = cartString;
    itemsList.innerHTML = itemsString;
    totalPrice.innerHTML = `Subtotal (<strong>${cartItemsTotal}</strong> items):₹ <strong>${totalPriceINR.toLocaleString()}</strong>`;
    noOfitems.innerText = cartItemsTotal;
}

// initialization
displayCartitems(cartProducts);