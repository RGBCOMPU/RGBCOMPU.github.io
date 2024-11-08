function handleInput() {
    alert("Entendido, nos comunicaremos contigo para asesorarte de la mejor manera.");
}

function handleSubmit() {
    alert("Gracias, hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.");
}

function handlePurchase() {
    alert("Gracias por su compra, nos comunicaremos con usted para realizar el envío.");
}

// Inicialización de usuarios predeterminados
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'usuario', password: 'user123', role: 'local' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Alternar entre formularios de inicio de sesión y registro
function toggleForm() {
    const formTitle = document.getElementById('formTitle');
    const loginForm = document.getElementById('loginForm');
    const isLogin = formTitle.textContent === 'Iniciar Sesión';

    formTitle.textContent = isLogin ? 'Registrar Usuario' : 'Iniciar Sesión';
    loginForm.onsubmit = isLogin ? handleRegister : handleLogin;
}

// Manejar el registro de un nuevo usuario
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

// Manejar el inicio de sesión
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

// Verificar si hay un usuario autenticado al cargar la página principal
window.onload = function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        document.getElementById('welcomeMessage').style.display = 'block';
        document.getElementById('username').textContent = loggedInUser.username;
    }
};


//DESDE AQUI

// Ejemplo de stock de computadoras
const stock = [
    { name: "Computador 1", quantity: 5 },
    { name: "Computador 2", quantity: 3 },
    { name: "Computador 3", quantity: 7 },
];

// Mostrar el stock si el usuario es administrador
function displayAdminStock() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'admin') {
        document.getElementById('admin-stock').style.display = 'block';
        
        const stockList = document.getElementById('stock-list');
        stockList.innerHTML = ''; // Limpiar el contenido previo
        stock.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name}: ${item.quantity} unidades disponibles`;
            stockList.appendChild(listItem);
        });
    }
}

// Función para mostrar u ocultar los botones de inicio/cierre de sesión
function updateLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'inline-block';
        displayAdminStock(); // Mostrar stock si es admin
    } else {
        document.getElementById('loginButton').style.display = 'inline-block';
        document.getElementById('logoutButton').style.display = 'none';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('loggedInUser');
    alert('Has cerrado sesión.');
    updateLoginStatus();
    document.getElementById('admin-stock').style.display = 'none';
    window.location.href = 'index.html'; // Redirigir a la página principal
}

// Llamar a updateLoginStatus al cargar la página
window.onload = function() {
    updateLoginStatus();
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

// Función para cargar los datos del perfil en perfil.html
function loadProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        document.getElementById('username').value = loggedInUser.username;
    }
}

// Función para actualizar el perfil del usuario
function updateProfile(event) {
    event.preventDefault();

    const newUsername = document.getElementById('username').value;
    const newPassword = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Actualiza el usuario en el listado de usuarios
    const userIndex = users.findIndex(user => user.username === loggedInUser.username);
    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        if (newPassword) {
            users[userIndex].password = newPassword;
        }

        // Guarda los cambios en localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Actualiza el usuario en localStorage para mantener la sesión
        loggedInUser.username = newUsername;
        if (newPassword) {
            loggedInUser.password = newPassword;
        }
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        alert('Perfil actualizado exitosamente.');
        window.location.href = 'index.html'; // Redirigir a la página principal
    }
}

// Llamar a loadProfile al cargar perfil.html
if (window.location.pathname.includes('perfil.html')) {
    window.onload = loadProfile;
}
