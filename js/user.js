const productContiner = document.getElementById('product_continer');
const modal = document.getElementById('modal');
let star = document.getElementsByClassName('user-rate');
let itemsOnScreen = document.getElementById('itemsOnScreen');
let filterCount = document.getElementById('filterCount');
let cartCount = document.getElementById('cartCount');

let products = [];
let cartProducts = [];

// check if data avliabel in local if not store it 

if (localStorage.getItem('cartProducts') === null) {
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
} else {
    cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
}

// check if data avliabel in local if not store it 

if (localStorage.getItem('products') === null) {
    localStorage.setItem('products', JSON.stringify(products));
} else {
    products = JSON.parse(localStorage.getItem('products'));
}

// main copy 
let filltredData = products;
let productId;

// unique category list for dropdown
let categoryList = products.map((product, index) => product.category)
categoryList = categoryList.filter((item, index, arr) => arr.indexOf(item) === index);

// displaying the product in product page 

let viewProduct = (id) => {
    modal.style.display = 'flex';
    productId = id;
    let product = products.find((product) => product.id === id);

    document.querySelector('#single-pro-img').src = product.imgUrl;
    document.querySelector('#single-pro-name').innerText = product.name;
    document.querySelector('#single-pro-price').innerText = '₹ ' + Number(product.price).toLocaleString();
    document.querySelector('#single-pro-category').innerText = product.category;
    document.querySelector('#single-pro-rate').style.width = `${product.numofrating>0?product.rating/product.numofrating*20:0}%`;
    document.querySelector('#num-of-rating').innerText = `(${product.numofrating}) ratings`;

    let sideimgs = product.sideImgUrls.split(',');

    // copy the main img URL 1st and then side img URLs
    let imgHtml = `<img class ='side-img-item' src='${product.imgUrl}' onclick = "changeImg('${product.imgUrl}')"/>`;
    sideimgs.forEach((sideimgurl, index) => {
        imgHtml += `<img class ='side-img-item' src='${sideimgurl}' onclick = "changeImg('${sideimgurl}')"/>`
    })
    document.querySelector('#sideimg').innerHTML = imgHtml;
}


// side images loading on click
let changeImg = (url) => {
    document.querySelector('#single-pro-img').src = url;
}

// for closing the modal when clicked outside of main area
let closeProductPage = (event, forceClose = true) => {
    if (forceClose) {
        modal.style.display = 'none';
    } else if (event.target.className === 'modal') {
        modal.style.display = 'none';
    }
}

//  close and open of filter section

let toggleFilterPanel = (status) => {

    let panel = document.querySelector('#leftpanel');
    closeProductPage('', true)

    status === true ? panel.style.marginLeft = '0' : panel.style.marginLeft = '-20%';

    let listcat = '<option value="">Select Category</option>';
    categoryList.forEach((item, index) => {
        listcat += `<option value="${item}">${item}</option>`;
    });

    document.getElementById('role').innerHTML = listcat;
}

// reset rating stars to grey

let clearRating = () => {
    for (let i = 0; i < 5; i++) {
        star[i].style.color = 'rgb(180, 173, 173)';
    }
}

// making all previous stars to gold on hover or on click

let selectRating = (rating) => {
    clearRating();
    for (let i = 0; i < rating; i++) {
        star[i].style.color = 'gold';
    }
}

//  capture rating and update all places and clear them 
let rateProduct = (rating) => {
    let product = products.find((product) => product.id === productId);
    product.rating += rating;
    product.numofrating++;

    localStorage.setItem('products', JSON.stringify(products));
    displayProducts(filltredData);
    document.querySelector('#single-pro-rate').style.width = `${product.numofrating>0?product.rating/product.numofrating*20:0}%`;
    document.querySelector('#num-of-rating').innerText = `(${product.numofrating}) ratings`;

    clearRating();
}

//  udpate cart array when product add to cart button clicked and display all products again to refect number change and button change

let addToCart = (id) => {
    cartProducts.push(products.find((product) => product.id === id));
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    window.alert('Amazing! Product added to cart !');
    cartCount.innerText = 'CART (' + cartProducts.length + ')';
    displayProducts(filltredData);
}

//  remove product from cart array when product remove from cart button clicked and display all products again to refect number change and button change

let removeFromCart = (id) => {
    let index = cartProducts.findIndex((product) => product.id === id);
    cartProducts.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    window.alert('Item removed !');
    cartCount.innerText = 'CART (' + cartProducts.length + ')';
    displayProducts(filltredData);
}

//  filter status tracker

let filters = {
    nameFilter: {
        status: false,
        value: ''
    },
    categoryFilter: {
        status: false,
        value: ''
    },
    minPriceFilter: {
        status: false,
        val: ''
    },
    maxPriceFilter: {
        status: false,
        val: ''
    },
    ratingFilter: {
        status: false,
        val: ''
    }
}

// filters 
// filter for string 

let searchProductsString = (data, filetrProp, val) => {
    let filltred = [];
    filltred = data.filter((p, index) => {
        return p[filetrProp].toLowerCase().includes(val.toLowerCase());
    });
    return filltred;
}

//  filter for min price 

let searchProductsRangeMin = (data, filetrProp, val) => {
    let filltred = data.filter((p, index) => {
        return Number(p[filetrProp]) >= val;
    });
    return filltred;
}

//  filter for max price 

let searchProductsRangeMax = (data, filetrProp, val) => {
    let filltred = [];
    if (val !== '') {
        filltred = data.filter((p, index) => {
            return Number(p[filetrProp]) <= val;
        });
    } else if (val === '') {
        filltred = data;
    }
    return filltred;
}

// filter for rating 

let searchProductsRate = (data, val) => {
    for (let i = 1; i < 6; i++) {
        if (i === val) {
            let selectedRate = document.querySelector(`#star${i}`);
            selectedRate.style.backgroundColor = 'rgb(255, 144, 100)';
        } else {
            let selectedRate = document.querySelector(`#star${i}`);
            selectedRate.style.backgroundColor = '#84848463';
        }
    }

    let filltred = data.filter((p, index) => { return (p.rating / p.numofrating) >= val; });
    return filltred;
}

// disply products with arry input 

let displayProducts = (data) => {

    let producthtml = '';
    itemsOnScreen.innerText = data.length + ' products from ' + products.length;
    filterCount.innerText = 'FILTER (' + data.length + ')';
    cartCount.innerText = 'CART (' + cartProducts.length + ')';

    let btnCheckVal = 0;
    let btnhtml = "<button class='btn'>Add Product</button>";

    data.forEach(function(element, index) {
        const { id, name, price, category, color, rating, imgUrl, numofrating } = element;
        btnCheckVal = searchProductsString(cartProducts, 'id', id).length;

        btnhtml = `<button class='btn' id ='${id}' onclick = "addToCart('${id}')">Add Product</button>`;

        if (btnCheckVal === 1) {
            btnhtml = `<button class='btn removebtn' id ='${id}' onclick = "removeFromCart('${id}')">Remove Product</button>`;
        } else {
            btnhtml = `<button class='btn' id ='${id}' onclick = "addToCart('${id}')">Add Product</button>`;
        }

        producthtml += `<div class="product">
            <div class="product-img">
                <img src="${imgUrl}" alt="">
            </div>
            <div class="product-details">
                <div class="title-rating">
                    <div>
                        <h2>${name}</h2>
                    </div>
                    <div class="rating">
                        <div>
                            <div class="gray-star">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="golden-star" style="width: ${numofrating>0?rating/numofrating*20:0}%;">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 class='product-price'>₹ ${Number(price).toLocaleString()}</h2>
                <h3 class = 'category ${category.toLowerCase()}'>${category}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                ${btnhtml}
                <button class="btn" onclick = "viewProduct('${id}')">View Product</button>
            </div>
        </div>`;
    });
    productContiner.innerHTML = producthtml;
}

// filter status tracker update and call filter search functions based on them

let setFilter = (filetrProp, val) => {

    filltredData = products;

    if (val !== null) {
        filters[filetrProp].status = true;
        filters[filetrProp].value = val;
    } else {
        filters[filetrProp].status = false;
        filters[filetrProp].value = '';
    }

    if (filters.nameFilter.status === true) {
        filltredData = searchProductsString(filltredData, 'name', filters.nameFilter.value);
    }

    if (filters.categoryFilter.status === true) {
        filltredData = searchProductsString(filltredData, 'category', filters.categoryFilter.value);
    }

    if (filters.minPriceFilter.status === true) {
        filltredData = searchProductsRangeMin(filltredData, 'price', filters.minPriceFilter.value);
    }

    if (filters.maxPriceFilter.status === true) {
        filltredData = searchProductsRangeMax(filltredData, 'price', filters.maxPriceFilter.value);
    }

    if (filters.ratingFilter.status === true) {
        filltredData = searchProductsRate(filltredData, filters.ratingFilter.value);
    }

    displayProducts(filltredData);
}

// clear filter fields on clear button or show all button click

let clearFields = () => {
    document.querySelector('#fillter_form').reset();
    for (let i = 1; i < 6; i++) {
        let selectedRate = document.querySelector(`#star${i}`);
        selectedRate.style.backgroundColor = '#84848463';
    }
    filters = {
        nameFilter: {
            status: false,
            value: ''
        },
        categoryFilter: {
            status: false,
            value: ''
        },
        minPriceFilter: {
            status: false,
            val: ''
        },
        maxPriceFilter: {
            status: false,
            val: ''
        },
        ratingFilter: {
            status: false,
            val: ''
        }
    }
    localStorage.setItem("localFilter", "");

    // setFilter('categoryFilter', '');
    displayProducts(products);
}

// initialization
let localFilter = '';
localFilter = localStorage.getItem("localFilter");
setFilter('categoryFilter', localFilter);