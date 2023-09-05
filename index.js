const searchBtn = document.getElementById("searchBtn");
const productsWrapper = document.getElementById("productsWrapper");
const pagination = document.getElementById("pagination");
const modalBtn = document.querySelector(".cart_icon");

const cartModal = document.getElementById("cartModal");
const cartItemsList = document.getElementById("cartItemsList");
const cartCloseBtn = document.querySelector(".close");
const select = document.getElementById("select");

function openCartModal() {
  cartModal.style.display = "block";
}

function closeCartModal() {
  cartModal.style.display = "none";
}

cartCloseBtn.addEventListener("click", () => {
  closeCartModal();
});

modalBtn.addEventListener("click", () => {
  openCartModal();
});

function renderCartItems(cart) {
  cartItemsList.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");

    listItem.classList.add("card_list_item");

    const img = document.createElement("img");
    img.src = item.thumbnail;

    const card = document.createElement("div");
    card.classList.add("product-card");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;
    description.style.height = "50px";
    description.style.overflow = "hidden";

    const price = document.createElement("strong");
    price.textContent = `$${item.price}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);

    listItem.appendChild(card);
    cartItemsList.appendChild(listItem);
  });
}

const itemPerPage = 20;
let currentPage = 1;
let currentData = [];

async function fetchData() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    if (response.ok) {
      currentData = data.products;
      const uniqueCategories = [
        ...new Set(currentData.map((product) => product.category)),
      ];

      select.innerHTML = "";
      uniqueCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });

      displayPage(currentData, currentPage, itemPerPage);
      displayPagination(currentData, itemPerPage);
    } else {
      console.error("Failed to fetch data");
    }
  } catch (error) {
    console.error(error);
  }
}

function displayPage(data, page, itemsPerPage) {
  if (!Array.isArray(data)) {
    console.error("Data is not an array.");
    return;
  }
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const Data = data.slice(start, end);
  productsWrapper.innerHTML = "";

  Data.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const img = document.createElement("img");
    img.src = product.thumbnail;

    const title = document.createElement("h3");
    title.textContent = product.title;

    title.style.marginBottom = "20px";

    const description = document.createElement("p");
    description.textContent = product.description;

    description.style.height = "50px";
    description.style.marginBottom = "20px";
    description.style.overflow = "hidden";

    const price = document.createElement("strong");
    price.textContent = `Price: ${product.price}$`;

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Add to Cart";
    addToCartButton.classList.add("add-to-cart-button");

    addToCartButton.addEventListener("click", () => {
      addToShoppingCartWithId(product);
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(addToCartButton);

    productsWrapper.appendChild(card);
  });
}

function displayPagination(data, itemsPerPage) {
  pagination.innerHTML = "";

  const totalPages = Math.ceil(data.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("button");
    pageLink.textContent = i;
    pageLink.classList.add("page-link");

    pageLink.addEventListener("click", () => {
      currentPage = i;
      displayPage(data, currentPage, itemsPerPage);
      updateActivePageLink();
    });

    pagination.appendChild(pageLink);
  }

  updateActivePageLink();
}

function updateActivePageLink() {
  const pageLinks = document.querySelectorAll(".page-link");
  pageLinks.forEach((link) => link.classList.remove("active"));
  pageLinks[currentPage - 1].classList.add("active");
}

fetchData();

select.addEventListener("change", () => {
  const selectedCategory = select.value;
  const filteredData = currentData.filter(
    (product) => product.category === selectedCategory
  );
  currentPage = 1;
  displayPage(filteredData, currentPage, itemPerPage);
  displayPagination(filteredData, itemPerPage);
});

const shoppingCart = [];

function addToShoppingCartWithId(product) {
  shoppingCart.push(product);
  updateShoppingCartUI();
}

function updateShoppingCartUI() {
  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  cartIcon.classList.add("cart-has-items");
  cartCount.textContent = shoppingCart.length;

  renderCartItems(shoppingCart);
}
renderCartItems(shoppingCart);

const search = async () => {
  try {
    const searchInput = document.getElementById("searchInput").value;
    console.log(searchInput);
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${searchInput}`
    );
    if (res.ok) {
      const searchedData = await res.json();
      console.log(searchedData.products);
      const searchedDataArray = searchedData.products;

      currentPage = 1;
      displayPage(searchedDataArray, currentPage, itemPerPage);
      displayPagination(searchedDataArray, itemPerPage);
    } else {
      console.error("Failed to fetch search results");
    }
  } catch (error) {
    console.error(error);
  }
};

searchBtn.addEventListener("click", () => {
  search();
});
