function handleInput() {
    alert("Entendido, nos comunicaremos contigo para asesorarte de la mejor manera.");
}

function handleSubmit() {
    alert("Gracias, hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.");
}

function handlePurchase() {
    alert("Gracias por su compra, nos comunicaremos con usted para realizar el envío.");
}

// Usuarios principales
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'usuario', password: 'user123', role: 'local' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// para poder cambair inicio de sesión y registro
function toggleForm() {
    const formTitle = document.getElementById('formTitle');
    const loginForm = document.getElementById('loginForm');
    const isLogin = formTitle.textContent === 'Iniciar Sesión';

    formTitle.textContent = isLogin ? 'Registrar Usuario' : 'Iniciar Sesión';
    loginForm.onsubmit = isLogin ? handleRegister : handleLogin;
}

// nuevo usuario
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        alert('El nombre de usuario ya está registrado.');
    } else {
        users.push({ username, password, role: 'local' });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Usuario registrado exitosamente.');
        window.location.href = 'index.html'; // Regresar a la página principal
    }
}

// inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Inicio de sesión exitoso.');
        window.location.href = 'index.html'; // Redirigir a la página principal
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

// Stock y precios
if (!localStorage.getItem('computers')) {
    const initialComputers = [
        { name: "Computador 1", quantity: 5, price: 6000000 },
        { name: "Computador 2", quantity: 3, price: 8000000 },
        { name: "Computador 3", quantity: 7, price: 7200000 }
    ];
    localStorage.setItem('computers', JSON.stringify(initialComputers));
}

// Mostrar el stock solo al admin
function displayAdminStock() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'admin') {
        document.getElementById('admin-stock').style.display = 'block';
        
        const stockList = document.getElementById('stock-list');
        stockList.innerHTML = ''; // Limpiar el contenido previo
        const computers = JSON.parse(localStorage.getItem('computers'));

        computers.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${item.name}</strong><br>
                Stock: <input type="number" value="${item.quantity}" min="0" id="stock-${index}">
                <button onclick="updateStock(${index})" style="font-size: 14px; padding: 5px 10px;">Actualizar Stock</button><br>
                Precio: $<input type="number" value="${item.price}" min="0" step="50000" id="price-${index}">
                <button onclick="updatePrice(${index})" class="button-spacing" style="font-size: 12px; padding: 5px 10px;">Actualizar Precio</button>
            `;
            stockList.appendChild(listItem);
        });
    }
}

// Actualizar el stock
function updateStock(index) {
    const newStock = parseInt(document.getElementById(`stock-${index}`).value, 10);
    const computers = JSON.parse(localStorage.getItem('computers'));
    computers[index].quantity = newStock;
    localStorage.setItem('computers', JSON.stringify(computers));
    alert(`Stock de ${computers[index].name} actualizado a ${newStock} unidades.`);
}

// Actualizar el precio
function updatePrice(index) {
    const newPrice = parseInt(document.getElementById(`price-${index}`).value, 10);
    const computers = JSON.parse(localStorage.getItem('computers'));
    computers[index].price = newPrice;
    localStorage.setItem('computers', JSON.stringify(computers));
    alert(`Precio de ${computers[index].name} actualizado a $${newPrice}.`);

    // Actualizar el precio en la pagina
    document.getElementById(`product-price-${index}`).textContent = `Precio: $${newPrice.toLocaleString()}`;
}

function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    const computers = JSON.parse(localStorage.getItem('computers'));

    productsContainer.innerHTML = '';
    computers.forEach((computer, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'computer';
        productDiv.innerHTML = `
            <img src="./Imagenes/Pc${index + 1}.jpg" alt="${computer.name}" class="computer-image" height="300px">
            <h3>${computer.name}</h3>
            <p>Características:<br>Procesador: Core i7<br>RAM: 16GB<br>GPU: RTX 3070</p>
            <p id="product-price-${index}">Precio: $${computer.price.toLocaleString()}</p>
            <button onclick="handlePurchase()">Comprar</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

window.onload = function() {
    updateLoginStatus();
    displayProducts(); 
};

function updateLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'inline-block';
        document.getElementById('perfilButton').style.display = 'inline-block';
        displayAdminStock(); // Mostrar stock si es admin
    } else {
        document.getElementById('loginButton').style.display = 'inline-block';
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('perfilButton').style.display = 'none';
    }
}

// cerrar sesión
function logout() {
    localStorage.removeItem('loggedInUser');
    alert('Has cerrado sesión.');
    updateLoginStatus();
    document.getElementById('admin-stock').style.display = 'none';
    window.location.href = 'index.html'; // Redirigir a la página principal
}

function loadProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('username').value = loggedInUser.username;
    }
}

// Actualizar el perfil
function updateProfile(event) {
    event.preventDefault();

    const newUsername = document.getElementById('username').value;
    const newPassword = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));


    const userIndex = users.findIndex(user => user.username === loggedInUser.username);
    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        if (newPassword) {
            users[userIndex].password = newPassword;
        }

       
        localStorage.setItem('users', JSON.stringify(users));
        
      
        loggedInUser.username = newUsername;
        if (newPassword) {
            loggedInUser.password = newPassword;
        }
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        alert('Perfil actualizado exitosamente.');
        window.location.href = 'index.html'; 
    }
}

if (window.location.pathname.includes('perfil.html')) {
    window.onload = loadProfile;
}
