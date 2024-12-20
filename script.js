let userDetails = {};
let orderItems = [];
let phoneNumber = [];
let allOrders = [];

document.getElementById('login-button').addEventListener('click', function() {
  const name = document.getElementById('user-name').value;
  const age = document.getElementById('user-age').value;
  const location = document.getElementById('user-location').value;

  if (age < 18) {
    alert("You must be 18 or older to order.");
    return;
  }

  userDetails = { name, age, location, phoneNumber };
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('cocktail-section').style.display = 'block';
  
  fetchCocktailData();
});

function fetchCocktailData() {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    .then(response => response.json())
    .then(data => {
      const cocktails = data.drinks;
      displayCocktails(cocktails);
    })
    .catch(error => {
      console.error("Error fetching cocktails:", error);
    });
}

function displayCocktails(cocktails) {
  const cocktailList = document.getElementById('cocktail-list');
  cocktailList.innerHTML = '';
  
  cocktails.forEach(cocktail => {
    const cocktailName = cocktail.strDrink;
    const cocktailImage = cocktail.strDrinkThumb;
    const cocktailIngredients = getCocktailIngredients(cocktail);
    const cocktailPrice = 950;  

    cocktailList.innerHTML += `
      <div class="cocktail-item">
        <h3>${cocktailName}</h3>
        <img src="${cocktailImage}" alt="${cocktailName}">
        <p><strong>Price:</strong> KSH ${cocktailPrice}</p>
        <p><strong>Ingredients:</strong> ${cocktailIngredients}</p>
        <button onclick="addToOrder('${cocktailName}', ${cocktailPrice})">Add to Order</button>
      </div>
    `;
  });
}

function getCocktailIngredients(cocktail) {
  let ingredients = [];
  
  for (let i = 1; i <= 15; i++) {
    if (cocktail[`strIngredient${i}`]) {
      ingredients.push(cocktail[`strIngredient${i}`]);
    }
  }

  return ingredients.join(', ');
}

function addToOrder(cocktailName, price) {
  orderItems.push({ cocktailName, price });
  alert(`${cocktailName} added to your order!`);
}

document.getElementById('place-order-button').addEventListener('click', function() {
  if (orderItems.length === 0) {
    alert("You must select at least one cocktail to order.");
    return;
  }

  const deliveryFee = 450;
  let totalPrice = 0;

  orderItems.forEach(item => {
    totalPrice += item.price;
  });

  totalPrice += deliveryFee;

  document.getElementById('order-details').innerHTML = `
    <p><strong>Name:</strong> ${userDetails.name}</p>
    <p><strong>Location:</strong> ${userDetails.location}</p>
    <p><strong>Order:</strong></p>
    <ul>
      ${orderItems.map(item => `<li>${item.cocktailName} - KSH ${item.price}</li>`).join('')}
    </ul>
    <p><strong>Delivery Fee:</strong> KSH 450</p>
    <p><strong>Total Price:</strong> KSH ${totalPrice}</p>
  `;
  document.getElementById('cocktail-section').style.display = 'none';
  document.getElementById('order-summary-section').style.display = 'block';

  allOrders.push({ ...userDetails, orderItems, totalPrice });
});

document.getElementById('view-orders-button').addEventListener('click', function() {
  const ordersList = document.getElementById('orders-list');
  ordersList.innerHTML = '';

  allOrders.forEach(order => {
    ordersList.innerHTML += `
      <div>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Location:</strong> ${order.location}</p>
        <p><strong>Order:</strong></p>
        <ul>
          ${order.orderItems.map(item => `<li>${item.cocktailName}</li>`).join('')}
        </ul>
        <p><strong>Total Price:</strong> KSH ${order.totalPrice}</p>
      </div>
      <hr>
    `;
  });

  document.getElementById('order-summary-section').style.display = 'none';
  document.getElementById('orders-list-section').style.display = 'block';
});

document.getElementById('back-button').addEventListener('click', function() {
  document.getElementById('orders-list-section').style.display = 'none';
  document.getElementById('order-summary-section').style.display = 'block';
});
