const tbody = document.getElementById('tbody');
const modal = document.getElementById('modal');
const updateModal = document.getElementById('update_modal');

let products = [];
let productToUpdate;

// check if data avliabel in local if not store it 

if (localStorage.getItem('products') === null) {
    localStorage.setItem('products', JSON.stringify(products));
} else {
    products = JSON.parse(localStorage.getItem('products'));
}

// modal close / open function
let toggleModal = (event, open) => {
    open = event.target.className.includes('close') ? false : true;
    open === true ? modal.style.display = 'flex' : modal.style.display = 'none';
}

let toggleUpdateModal = (event, open, id = null) => {
    open = event.target.className.includes('close') ? false : true;
    open === true ? updateModal.style.display = 'flex' : updateModal.style.display = 'none';
    if (id !== null) {
        fillUpdateData(id);
    }
}

//  get data from modal and add product

let addProduct = () => {
    let product = { rating: 0, numofrating: 0 };

    if (localStorage.getItem("productId") == null) {
        localStorage.setItem("productId", "1");
        product.id = 'p1'
    } else {
        let lastId = Number(localStorage.getItem("productId"));
        let newId = lastId + 1;
        localStorage.setItem("productId", newId.toString());

        product.id = 'p' + newId;
    }

    product.name = document.querySelector('#add_name').value;
    product.price = document.querySelector('#add_price').value;
    product.category = document.querySelector('#add_category').value;
    product.color = document.querySelector('#add_color').value;
    product.imgUrl = document.querySelector('#add_img_url').value;
    product.sideImgUrls = document.querySelector('#add_side_img_url').value;

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    document.querySelector('#add_form').reset(); //  this is form specific funcation reset()
    displayProducts(products);
}

// delete product from main Array

let deleteProduct = (id) => {
    let index = products.findIndex((product) => product.id === id)
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts(products);
}

// pre fill data for update modal

let fillUpdateData = (id) => {
    productToUpdate = products.find((product) => product.id === id);
    document.querySelector('#update_name').value = productToUpdate.name;
    document.querySelector('#update_price').value = productToUpdate.price;
    document.querySelector('#update_category').value = productToUpdate.category;
    document.querySelector('#update_color').value = productToUpdate.color;
    document.querySelector('#update_img_url').value = productToUpdate.imgUrl;
    document.querySelector('#update_side_img_url').value = productToUpdate.sideImgUrls;
}

// udpate products on submit from modal

let updateProduct = () => {
    productToUpdate.name = document.querySelector('#update_name').value;
    productToUpdate.price = document.querySelector('#update_price').value;
    productToUpdate.category = document.querySelector('#update_category').value;
    productToUpdate.color = document.querySelector('#update_color').value;
    productToUpdate.imgUrl = document.querySelector('#update_img_url').value;
    productToUpdate.sideImgUrls = document.querySelector('#update_side_img_url').value;

    // products[indexToUpdate] = productToUpdate; no needed
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts(products);
}

// display products with array input 

let displayProducts = (data) => {

    let producthtml = '';

    data.forEach(function(element, index) {
        const { id, name, price, category, color, rating, numofrating } = element;
        producthtml += `
            <tr>
            <td>${index+1}</td>
            <td>${id}</td>
            <td>${name}</td>
            <td style= 'vertical-align: middle;'>₹ ${Number(price).toLocaleString()}</td>
            <td>${category}</td>
            <td><div class='productColor' style='background-color:${color}'></div></td>
            <td style= 'text-align: center; vertical-align: middle;'>${numofrating>0?(rating/numofrating).toFixed(2):0}</td>
            <td><button class='btn-s updateColor' onclick="toggleUpdateModal(event,true,'${id}')">Update</button>
            <button class='btn-s deleteColor' onclick = "deleteProduct('${id}')">Delete</button>
            </td>
            </tr>`;
    });
    tbody.innerHTML = producthtml;
}

// initialization
displayProducts(products);