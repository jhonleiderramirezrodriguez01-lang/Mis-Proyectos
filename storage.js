const STORAGE_USERS = "systemslUsers";
const STORAGE_SESSION = "systemslSession";
const STORAGE_SERVICES = "systemslServices";
const STORAGE_PURCHASES = "systemslPurchases";
const STORAGE_CART = "systemslCart";
const STORAGE_CHATS = "systemslClientChats";

function getUsers() {
  const stored = localStorage.getItem(STORAGE_USERS);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function getSession() {
  const stored = localStorage.getItem(STORAGE_SESSION);
  return stored ? JSON.parse(stored) : null;
}

function setSession(session) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_SESSION);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUsers().find(user => user.email.toLowerCase() === session.email.toLowerCase()) || null;
}

function findUserByEmail(email) {
  if (!email) return null;
  return getUsers().find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

function createUser({ name, email, password, role }) {
  const users = getUsers();
  const existing = findUserByEmail(email);
  if (existing) return null;
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(user => user.email.toLowerCase() === updatedUser.email.toLowerCase());
  if (index === -1) return false;
  users[index] = { ...users[index], ...updatedUser };
  saveUsers(users);
  return true;
}

function removeUser(email) {
  const users = getUsers().filter(user => user.email.toLowerCase() !== email.toLowerCase());
  saveUsers(users);
}

function getServices() {
  const stored = localStorage.getItem(STORAGE_SERVICES);
  return stored ? JSON.parse(stored) : [];
}

function saveServices(services) {
  localStorage.setItem(STORAGE_SERVICES, JSON.stringify(services));
}

function getPurchases() {
  const stored = localStorage.getItem(STORAGE_PURCHASES);
  return stored ? JSON.parse(stored) : [];
}

function savePurchases(purchases) {
  localStorage.setItem(STORAGE_PURCHASES, JSON.stringify(purchases));
}

function getServicesByVendor(vendorEmail) {
  return getServices().filter(service => service.vendor.toLowerCase() === vendorEmail.toLowerCase());
}

function getPurchasesByClient(clientEmail) {
  return getPurchases().filter(purchase => purchase.client.toLowerCase() === clientEmail.toLowerCase());
}

function getPurchasesByVendor(vendorEmail) {
  return getPurchases().filter(purchase => purchase.vendor.toLowerCase() === vendorEmail.toLowerCase());
}

function getCart() {
  const stored = localStorage.getItem(STORAGE_CART);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cartItems) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cartItems));
}

function addToCart(service) {
  const cart = getCart();
  const exists = cart.find(item => item.serviceId === service.id);
  if (exists) return cart;
  cart.push({
    id: Date.now().toString(),
    serviceId: service.id,
    title: service.title,
    price: service.price,
    vendor: service.vendor,
    addedAt: new Date().toISOString(),
  });
  saveCart(cart);
  return cart;
}

function removeFromCart(serviceId) {
  const cart = getCart().filter(item => item.serviceId !== serviceId);
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
  return [];
}

function getClientChats(clientEmail) {
  const stored = localStorage.getItem(STORAGE_CHATS);
  const chats = stored ? JSON.parse(stored) : [];
  return chats.filter(chat => chat.userEmail.toLowerCase() === clientEmail.toLowerCase());
}

function saveClientChats(chats) {
  localStorage.setItem(STORAGE_CHATS, JSON.stringify(chats));
}

function addClientChat({ userEmail, sender, text, role = "cliente" }) {
  const chats = JSON.parse(localStorage.getItem(STORAGE_CHATS) || "[]");
  const entry = {
    id: Date.now().toString(),
    userEmail: userEmail.toLowerCase(),
    sender,
    role,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  chats.push(entry);
  saveClientChats(chats);
  return entry;
}

function getServiceById(serviceId) {
  return getServices().find(service => service.id === serviceId) || null;
}

function initDefaultData() {
  const users = getUsers();
  if (users.length === 0) {
    saveUsers([
      {
        id: "admin-1",
        name: "Administrador Demo",
        email: "admin@example.com",
        password: "admin123",
        role: "administrador",
        createdAt: new Date().toISOString(),
      },
      {
        id: "vendor-1",
        name: "Vendedor Demo",
        email: "vendedor@example.com",
        password: "vendedor123",
        role: "vendedor",
        createdAt: new Date().toISOString(),
      },
      {
        id: "client-1",
        name: "Cliente Demo",
        email: "cliente@example.com",
        password: "cliente123",
        role: "cliente",
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  const services = getServices();
  if (services.length === 0) {
    saveServices([
      { id: "service-1", title: "Landing Page Pro", description: "Página web profesional para captar clientes, mostrar tu oferta y convertir visitas en cotizaciones.", price: 800000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-2", title: "SEO Local + Google", description: "Optimización para que tu negocio aparezca más en Google, Maps y búsquedas locales relevantes.", price: 950000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-3", title: "Gestión de Redes Sociales", description: "Contenido, calendario y campañas para fortalecer tu marca y aumentar el alcance en Instagram, Facebook y TikTok.", price: 1200000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-4", title: "Automatización de Email", description: "Campañas de email y mensajes automáticos para recordar, vender y fidelizar clientes con mayor frecuencia.", price: 1500000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-5", title: "CRM y Gestión de Leads", description: "Sistema para organizar contactos, seguimientos y oportunidades de venta en un solo panel.", price: 2000000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-6", title: "Dashboard de Analítica", description: "Panel de métricas para ver tráfico, conversiones, ventas y oportunidades de mejora en tiempo real.", price: 500000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-7", title: "HubSpot CRM Starter", description: "Automatiza seguimiento de clientes, ventas y campañas con un CRM listo para crecer.", price: 1100000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-8", title: "Mailchimp Campañas", description: "Email marketing, newsletters y automatizaciones para fidelizar clientes y aumentar conversiones.", price: 900000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-9", title: "Canva Design Studio", description: "Diseño de piezas visuales, anuncios y contenido para redes sociales con una marca profesional.", price: 750000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-10", title: "SEMrush SEO Suite", description: "Análisis de palabras clave, competencia y posicionamiento para atraer tráfico cualificado.", price: 1300000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-11", title: "Hootsuite Social Planner", description: "Programación y gestión de publicaciones en redes para mantener tu marca activa todos los días.", price: 850000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
      { id: "service-12", title: "Google Ads + Meta Ads", description: "Campañas publicitarias digitales para llegar a nuevos clientes en Google, Facebook e Instagram.", price: 1600000, vendor: "vendedor@example.com", createdAt: new Date().toISOString() },
    ]);
  }

  const purchases = getPurchases();
  if (purchases.length === 0) {
    savePurchases([
      {
        id: "purchase-1",
        client: "cliente@example.com",
        vendor: "vendedor@example.com",
        serviceId: "service-1",
        serviceTitle: "Campaña de anuncios digitales",
        price: 250000,
        status: "Confirmado",
        createdAt: new Date().toISOString(),
      },
    ]);
  }
}

function getStats() {
  const users = getUsers();
  const services = getServices();
  const purchases = getPurchases();
  return {
    totalUsers: users.length,
    totalClientes: users.filter(u => u.role === "cliente").length,
    totalVendedores: users.filter(u => u.role === "vendedor").length,
    totalAdministradores: users.filter(u => u.role === "administrador").length,
    totalServicios: services.length,
    totalCompras: purchases.length,
    totalIngresos: purchases.reduce((sum, purchase) => sum + (purchase.price || 0), 0),
  };
}

initDefaultData();
