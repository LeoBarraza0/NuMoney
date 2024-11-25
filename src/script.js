// Mock data
const mockData = {
    users: [
        {
            id: '1',
            name: 'Juan Pérez',
            phone: '3001234567',
            email: 'juan@example.com',
            password: 'password123'
        }
    ],
    accounts: [
        {
            id: '1',
            userId: '1',
            accountNumber: '1234567890',
            type: 'Savings',
            balance: 1500000
        },
        {
            id: '2',
            userId: '1',
            accountNumber: '0987654321',
            type: 'Checking',
            balance: 500000
        }
    ],
    transactions: [
        {
            id: '1',
            accountId: '1',
            type: 'Transfer',
            amount: 100000,
            description: 'Transfer to account 0987654321',
            date: new Date('2023-05-01T10:30:00')
        }
    ],
    services: [
        { id: '1', name: 'Electricity' },
        { id: '2', name: 'Water' },
        { id: '3', name: 'Internet' }
    ],
    providers: [
        { id: '1', serviceId: '1', name: 'ElectriCo' },
        { id: '2', serviceId: '2', name: 'AquaCorp' },
        { id: '3', serviceId: '3', name: 'InternetPlus' }
    ]
};

// Global variables
let currentUser = null;
let selectedAccount = null;

// DOM elements
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const userAvatarElement = document.getElementById('userAvatar');
const accountSelectElement = document.getElementById('accountSelect');
const balanceElement = document.getElementById('balance');
const addMoneyBtn = document.getElementById('addMoneyBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const transferBtn = document.getElementById('transferBtn');
const payBillsBtn = document.getElementById('payBillsBtn');
const requestMoneyBtn = document.getElementById('requestMoneyBtn');
const rechargeBtn = document.getElementById('rechargeBtn');
const transactionsList = document.getElementById('transactionsList');
const serviceTypeSelect = document.getElementById('serviceType');
const serviceProviderSelect = document.getElementById('serviceProvider');
const servicePaymentForm = document.getElementById('servicePaymentForm');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const modalFields = document.getElementById('modalFields');
const modalError = document.getElementById('modalError');

// Initialize the app
function init() {
    setupEventListeners();
    loadServiceTypes();
    loadServiceProviders();
}

// Setup event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegisterLink.addEventListener('click', showRegister);
    showLoginLink.addEventListener('click', showLogin);
    accountSelectElement.addEventListener('change', handleAccountChange);
    addMoneyBtn.addEventListener('click', () => openModal('Add Money', [{ name: 'amount', type: 'number', label: 'Amount to add' }], handleAddMoney));
    withdrawBtn.addEventListener('click', () => openModal('Withdraw Money', [{ name: 'amount', type: 'number', label: 'Amount to withdraw' }], handleWithdraw));
    transferBtn.addEventListener('click', () => openModal('Transfer Money', [
        { name: 'accountNumber', type: 'text', label: 'Recipient Account Number' },
        { name: 'amount', type: 'number', label: 'Amount to transfer' }
    ], handleTransfer));
    requestMoneyBtn.addEventListener('click', () => openModal('Request Money', [
        { name: 'accountNumber', type: 'text', label: 'Account Number to Request From' },
        { name: 'amount', type: 'number', label: 'Amount to request' }
    ], handleRequestMoney));
    servicePaymentForm.addEventListener('submit', handlePayService);
    tabButtons.forEach(button => {
        button.addEventListener('click', () => setActiveTab(button.dataset.tab));
    });
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const user = mockData.users.find(u => u.phone === phone && u.password === password);
    if (user) {
        currentUser = user;
        showMainApp();
    } else {
        alert('Invalid credentials');
    }
}

// Handle register
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const newUser = {
        id: (mockData.users.length + 1).toString(),
        name,
        phone,
        email,
        password
    };
    mockData.users.push(newUser);
    alert('Registration successful. Please log in.');
    showLogin();
}

// Show register form
function showRegister() {
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
}

// Show login form
function showLogin() {
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
}

// Show main app
function showMainApp() {
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    mainApp.classList.remove('hidden');
    loadUserData();
    loadAccounts();
    loadTransactions();
}

// Load user data
function loadUserData() {
    userNameElement.textContent = currentUser.name;
    userEmailElement.textContent = currentUser.email;
    userAvatarElement.src = `https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.name}`;
}

// Load accounts
function loadAccounts() {
    accountSelectElement.innerHTML = '<option value="">Select account</option>';
    const userAccounts = mockData.accounts.filter(account => account.userId === currentUser.id);
    userAccounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.accountNumber} (${account.type})`;
        accountSelectElement.appendChild(option);
    });
}

// Handle account change
function handleAccountChange(event) {
    const accountId = event.target.value;
    selectedAccount = mockData.accounts.find(account => account.id === accountId);
    updateAccountBalance();
    loadTransactions();
}

// Update account balance
function updateAccountBalance() {
    if (selectedAccount) {
        balanceElement.textContent = selectedAccount.balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    } else {
        balanceElement.textContent = '';
    }
}

// Load transactions
function loadTransactions() {
    transactionsList.innerHTML = '';
    if (selectedAccount) {
        const accountTransactions = mockData.transactions.filter(t => t.accountId === selectedAccount.id);
        accountTransactions.sort((a, b) => b.date - a.date).slice(0, 5).forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            transactionElement.innerHTML = `
                <div class="transaction-icon ${transaction.type === 'Transfer' ? 'bg-red-500' : 'bg-green-500'}">
                    ${transaction.type === 'Transfer' ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>' : 
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>'
                    }
                </div>
                <div class="transaction-details">
                    <p>${transaction.description}</p>
                    <small>${transaction.date.toLocaleString()}</small>
                </div>
                <p class="transaction-amount ${transaction.type === 'Transfer' ? 'text-red-500' : 'text-green-500'}">
                    ${transaction.type === 'Transfer' ? '-' : '+'}${transaction.amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </p>
            `;
            transactionsList.appendChild(transactionElement);
        });
    }
}

// Load service types
function loadServiceTypes() {
    serviceTypeSelect.innerHTML = '<option value="">Select service type</option>';
    mockData.services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        serviceTypeSelect.appendChild(option);
    });
}

// Load service providers
function loadServiceProviders() {
    serviceProviderSelect.innerHTML = '<option value="">Select provider</option>';
    serviceTypeSelect.addEventListener('change', (event) => {
        const serviceId = event.target.value;
        const providers = mockData.providers.filter(provider => provider.serviceId === serviceId);
        serviceProviderSelect.innerHTML = '<option value="">Select provider</option>';
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.id;
            option.textContent = provider.name;
            serviceProviderSelect.appendChild(option);
        });
    });
}

// Handle add money
function handleAddMoney(formData) {
    const amount = parseFloat(formData.get('amount'));
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
    }
    if (selectedAccount) {
        selectedAccount.balance += amount;
        updateAccountBalance();
        addTransaction('Deposit', amount, 'Money added to account');
        console.log(`Added ${amount} to account ${selectedAccount.accountNumber}`);
    }
}

// Handle withdraw
function handleWithdraw(formData) {
    const amount = parseFloat(formData.get('amount'));
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
    }
    if (selectedAccount) {
        if (amount > selectedAccount.balance) {
            throw new Error('Insufficient funds');
        }
        selectedAccount.balance -= amount;
        updateAccountBalance();
        addTransaction('Withdrawal', amount, 'Money withdrawn from account');
        console.log(`Withdrew ${amount} from account ${selectedAccount.accountNumber}`);
    }
}

// Handle transfer
function handleTransfer(formData) {
    const accountNumber = formData.get('accountNumber');
    const amount = parseFloat(formData.get('amount'));
    if (!accountNumber) {
        throw new Error('Please enter a valid account number');
    }
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
    }
    if (selectedAccount) {
        if (amount > selectedAccount.balance) {
            throw new Error('Insufficient funds');
        }
        selectedAccount.balance -= amount;
        updateAccountBalance();
        addTransaction('Transfer', amount, `Transfer to account ${accountNumber}`);
        console.log(`Transferred ${amount} from account ${selectedAccount.accountNumber} to account ${accountNumber}`);
    }
}

// Handle request money
function handleRequestMoney(formData) {
    const accountNumber = formData.get('accountNumber');
    const amount = parseFloat(formData.get('amount'));
    if (!accountNumber) {
        throw new Error('Please enter a valid account number');
    }
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
    }
    console.log(`Requested ${amount} from account ${accountNumber}`);
}

// Handle pay service
function handlePayService(event) {
    event.preventDefault();
    const serviceType = serviceTypeSelect.value;
    const serviceProvider = serviceProviderSelect.value;
    const amount = parseFloat(document.getElementById('serviceAmount').value);

    if (!serviceType || !serviceProvider) {
        alert('Please select a service type and provider');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (selectedAccount) {
        if (amount > selectedAccount.balance) {
            alert('Insufficient funds');
            return;
        }
        selectedAccount.balance -= amount;
        updateAccountBalance();
        addTransaction('Service Payment', amount, `Payment for ${serviceType} to ${serviceProvider}`);
        console.log(`Paying ${amount} for ${serviceType} to provider ${serviceProvider}`);
    } else {
        alert('Please select an account');
    }
}

// Set active tab
function setActiveTab(tabId) {
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeButton && activeContent) {
        activeButton.classList.add('active');
        activeContent.classList.add('active');
    }
}

// Open modal
function openModal(title, fields, onSubmit) {
    modalTitle.textContent = title;
    modalFields.innerHTML = '';
    fields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.innerHTML = `
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}" required>
        `;
        modalFields.appendChild(fieldElement);
    });
    modalError.classList.add('hidden');
    modalError.textContent = '';
    modalForm.onsubmit = (event) => {
        event.preventDefault();
        try {
            onSubmit(new FormData(modalForm));
            closeModal();
        } catch (error) {
            modalError.classList.remove('hidden');
            modalError.textContent = error.message;
        }
    };
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Add transaction
function addTransaction(type, amount, description) {
    const newTransaction = {
        id: (mockData.transactions.length + 1).toString(),
        accountId: selectedAccount.id,
        type: type,
        amount: amount,
        description: description,
        date: new Date(),
    };
    mockData.transactions.unshift(newTransaction);
    loadTransactions();
}

// Initialize the app
init();

// Mock data

// Global variables


const notificationBtn = document.getElementById('notificationBtn');
const notificationCount = document.getElementById('notificationCount');
const notificationModal = document.getElementById('notificationModal');
const notificationList = document.getElementById('notificationList');
const closeNotificationsBtn = document.getElementById('closeNotifications');

// Initialize the app
function init() {
    setupEventListeners();
    loadServiceTypes();
    loadServiceProviders();
}

// Setup event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegisterLink.addEventListener('click', showRegister);
    showLoginLink.addEventListener('click', showLogin);
    accountSelectElement.addEventListener('change', handleAccountChange);
    addMoneyBtn.addEventListener('click', () => openModal('Add Money', [{ name: 'amount', type: 'number', label: 'Amount to add' }], handleAddMoney));
    withdrawBtn.addEventListener('click', () => openModal('Withdraw Money', [{ name: 'amount', type: 'number', label: 'Amount to withdraw' }], handleWithdraw));
    transferBtn.addEventListener('click', () => openModal('Transfer Money', [
        { name: 'accountNumber', type: 'text', label: 'Recipient Account Number' },
        { name: 'amount', type: 'number', label: 'Amount to transfer' }
    ], handleTransfer));
    requestMoneyBtn.addEventListener('click', () => openModal('Request Money', [
        { name: 'accountNumber', type: 'text', label: 'Account Number to Request From' },
        { name: 'amount', type: 'number', label: 'Amount to request' }
    ], handleRequestMoney));
    rechargeBtn.addEventListener('click', () => openModal('Recharge', [
        { name: 'phoneNumber', type: 'text', label: 'Phone Number' },
        { name: 'amount', type: 'number', label: 'Amount to recharge' }
    ], handleRecharge));
    servicePaymentForm.addEventListener('submit', handlePayService);
    tabButtons.forEach(button => {
        button.addEventListener('click', () => setActiveTab(button.dataset.tab));
    });
    notificationBtn.addEventListener('click', showNotifications);
    closeNotificationsBtn.addEventListener('click', closeNotifications);
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    // In a real app, you would validate credentials here
    mockData.currentUser = {
        IdCliente: '1',
        NombreCompleto: 'John Doe',
        Correo: 'john@example.com',
    };
    loadUserData();
    showMainApp();
}

// Handle register
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    // In a real app, you would send this data to the server
    console.log('Registered:', { name, phone, email, password });
    showLogin();
}

// Show register form
function showRegister(event) {
    event.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
}

// Show login form
function showLogin(event) {
    if (event) event.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
}

// Show main app
function showMainApp() {
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    mainApp.classList.remove('hidden');
    loadAccounts();
    loadTransactions();
}

// Load user data
function loadUserData() {
    const { NombreCompleto, Correo } = mockData.currentUser;
    userNameElement.textContent = NombreCompleto;
    userEmailElement.textContent = Correo;
    userAvatarElement.src = `https://api.dicebear.com/6.x/initials/svg?seed=${NombreCompleto}`;
}

// Load accounts
function loadAccounts() {
    accountSelectElement.innerHTML = '<option value="">Select account</option>';
    mockData.cuentas.forEach(cuenta => {
        const option = document.createElement('option');
        option.value = cuenta.IdCuenta;
        option.textContent = `${cuenta.NumeroCuenta} (${cuenta.TipoCuenta})`;
        accountSelectElement.appendChild(option);
    });
}

// Load transactions
function loadTransactions() {
    transactionsList.innerHTML = '';
    const transactions = selectedAccount
        ? mockData.transacciones.filter(t => t.IdCuentaOrigen_fk === selectedAccount.IdCuenta || t.IdCuentaDestino_fk === selectedAccount.IdCuenta)
        : mockData.transacciones;
    
    transactions.sort((a, b) => new Date(b.FechaHora) - new Date(a.FechaHora)).slice(0, 5).forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        transactionElement.innerHTML = `
            <div class="transaction-icon ${transaction.IdCuentaOrigen_fk === selectedAccount?.IdCuenta ? 'bg-red-500' : 'bg-green-500'}">
                ${transaction.IdCuentaOrigen_fk === selectedAccount?.IdCuenta ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>' : 
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>'
                }
            </div>
            <div class="transaction-details">
                <p>${transaction.Descripcion}</p>
                <small>${new Date(transaction.FechaHora).toLocaleString()}</small>
            </div>
            <p class="transaction-amount ${transaction.IdCuentaOrigen_fk === selectedAccount?.IdCuenta ? 'text-red-500' : 'text-green-500'}">
                ${transaction.IdCuentaOrigen_fk === selectedAccount?.IdCuenta ? '-' : '+'}${transaction.MontoAplica.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </p>
        `;
        transactionsList.appendChild(transactionElement);
    });
}

// Load service types
function loadServiceTypes() {
    serviceTypeSelect.innerHTML = '<option value="">Select service type</option>';
    mockData.tiposServicio.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.IdTipoS;
        option.textContent = tipo.NombreTipoServicio;
        serviceTypeSelect.appendChild(option);
    });
}

// Load service providers
function loadServiceProviders() {
    serviceProviderSelect.innerHTML = '<option value="">Select provider</option>';
    mockData.proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.IdProveedor;
        option.textContent = proveedor.Nombre;
        serviceProviderSelect.appendChild(option);
    });
}

// Handle account change
function handleAccountChange(event) {
    const accountId = event.target.value;
    selectedAccount = mockData.cuentas.find(cuenta => cuenta.IdCuenta === accountId);
    updateAccountBalance();
    loadTransactions();
}

// Update account balance
function updateAccountBalance() {
    if (selectedAccount) {
        balanceElement.textContent = selectedAccount.SaldoActual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    } else {
        balanceElement.textContent = '';
    }
}

// Handle