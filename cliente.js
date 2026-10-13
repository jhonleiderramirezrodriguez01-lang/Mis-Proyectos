document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "cliente") {
    window.location.href = "iniciarsession.html";
    return;
  }

  const content = document.getElementById("clientContent");
  const buttons = document.querySelectorAll(".action-btn");
  const headerDesc = document.querySelector(".section-desc");

  function goToAction(action) {
    if (action === "Editar perfil") {
      renderProfile();
    } else if (action === "Ver servicios") {
      renderServices();
    } else if (action === "Ver compras") {
      renderPurchases();
    } else if (action === "Ver carrito") {
      renderCart();
    } else if (action === "Abrir chat") {
      renderChat();
    }
  }
  if (headerDesc) {
    headerDesc.textContent = `Hola ${currentUser.name}, administra tu perfil y revisa tus compras recientes.`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  buttons.forEach(button => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const action = this.dataset.action;
      goToAction(action);
      document.getElementById("clientContent")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".dashboard-card").forEach(card => {
    card.addEventListener("click", function (event) {
      if (event.target.closest("button")) return;
      goToAction(this.dataset.action);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goToAction(this.dataset.action);
      }
    });
  });

  const cartQuickAccess = document.getElementById("cartQuickAccess");
  if (cartQuickAccess) {
    cartQuickAccess.addEventListener("click", function () {
      renderCart();
      document.getElementById("clientContent")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function renderProfile() {
    const user = getCurrentUser();
    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Mi perfil</h3>
        <form id="clientProfileForm">
          <div class="mb-3">
            <label class="form-label">Nombre completo</label>
            <input type="text" class="form-control" id="profileName" value="${escapeHtml(user.name)}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" id="profileEmail" value="${escapeHtml(user.email)}" disabled>
          </div>
          <div class="mb-3">
            <label class="form-label">Rol</label>
            <input type="text" class="form-control" value="${escapeHtml(user.role)}" disabled>
          </div>
          <div class="mb-4">
            <label class="form-label">Nueva contraseña</label>
            <input type="password" class="form-control" id="profilePassword" placeholder="Deja vacío para mantener la actual">
          </div>
          <button type="submit" class="btn btn-brand">Guardar cambios</button>
        </form>
      </div>
    `;

    const profileForm = document.getElementById("clientProfileForm");
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("profileName").value.trim();
      const password = document.getElementById("profilePassword").value;

      if (!name) {
        alert("Ingresa tu nombre.");
        return;
      }

      const updatedUser = { ...user, name };
      if (password) {
        updatedUser.password = password;
      }

      updateUser(updatedUser);
      const session = getSession();
      if (session) {
        setSession({ ...session, name: updatedUser.name });
      }
      alert("Perfil actualizado correctamente.");
      renderProfile();
    });
  }

  function renderServices() {
    const user = getCurrentUser();
    const services = getServices();
    const purchases = getPurchasesByClient(user.email);
    const icons = [
      'bi-browser-safari',
      'bi-graph-up-arrow',
      'bi-megaphone',
      'bi-envelope-paper',
      'bi-person-lines-fill',
      'bi-bar-chart-line-fill'
    ];

    const available = services.map((service, index) => {
      const vendor = findUserByEmail(service.vendor);
      const alreadyBought = purchases.some(purchase => purchase.serviceId === service.id);
      const icon = icons[index % icons.length];
      return `
        <article class="col-md-6 col-xl-4">
          <div class="dashboard-card h-100 p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge bg-light text-dark">PAQ ${String(index + 1).padStart(2, '0')}</span>
              <span class="text-white-50 small">Marketing digital</span>
            </div>
            <div class="card-icon mb-3"><i class="bi ${icon}"></i></div>
            <h5 class="mb-2">${escapeHtml(service.title)}</h5>
            <p class="mb-3">${escapeHtml(service.description)}</p>
            <div class="service-price mb-3">${service.price.toLocaleString()} COP</div>
            <p class="small text-white-50 mb-3">Vendedor: ${vendor ? escapeHtml(vendor.name) : escapeHtml(service.vendor)}</p>
            <div class="d-grid gap-2 mt-2">
              <button class="btn ${alreadyBought ? 'btn-secondary' : 'btn-brand'} buy-service" data-id="${service.id}" ${alreadyBought ? 'disabled' : ''}>
                ${alreadyBought ? 'Ya contratado' : 'Contratar servicio'}
              </button>
              <button class="btn btn-outline-brand add-to-cart" data-id="${service.id}">Agregar al carrito</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    content.innerHTML = `
      <section class="dashboard-card p-4">
        <h3 class="mb-2">Servicios disponibles</h3>
        <p class="text-white-50 mb-4">Aquí puedes ver todos los paquetes de marketing digital y contratar los que mejor se adapten a tu negocio.</p>
        <div class="row g-4">${available || '<div class="col-12"><p>No hay servicios disponibles en este momento.</p></div>'}</div>
      </section>
    `;

    document.querySelectorAll(".buy-service").forEach(button => {
      button.addEventListener("click", function () {
        const serviceId = this.dataset.id;
        const service = getServiceById(serviceId);
        if (!service) return;

        const existingPurchases = getPurchasesByClient(user.email);
        if (existingPurchases.some(purchase => purchase.serviceId === service.id)) {
          alert("Ya tienes este servicio contratado.");
          return;
        }

        const purchasesList = getPurchases();
        purchasesList.push({
          id: Date.now().toString(),
          client: user.email,
          vendor: service.vendor,
          serviceId: service.id,
          serviceTitle: service.title,
          price: service.price,
          status: "Pendiente",
          createdAt: new Date().toISOString(),
        });
        savePurchases(purchasesList);
        alert("Servicio contratado con éxito.");
        renderServices();
      });
    });

    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", function () {
        const serviceId = this.dataset.id;
        const service = getServiceById(serviceId);
        if (!service) return;
        addToCart(service);
        alert(`"${service.title}" se agregó al carrito.`);
      });
    });
  }

  function renderCart() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    if (cart.length === 0) {
      content.innerHTML = `
        <section class="dashboard-card p-4">
          <h3 class="mb-2">Tu carrito</h3>
          <p class="text-white-50">Aún no has agregado servicios. Ve a “Ver servicios” para elegir tus paquetes.</p>
        </section>
      `;
      return;
    }

    const rows = cart.map(item => `
      <li class="list-group-item bg-transparent border-white-10 d-flex justify-content-between align-items-center text-white">
        <span>
          <strong>${escapeHtml(item.title)}</strong><br>
          <small class="text-white-50">${item.price.toLocaleString()} COP</small>
        </span>
        <button class="btn btn-outline-brand btn-sm remove-cart-item" data-id="${item.serviceId}">Quitar</button>
      </li>
    `).join("");

    content.innerHTML = `
      <section class="dashboard-card p-4">
        <h3 class="mb-2">Tu carrito</h3>
        <p class="text-white-50 mb-3">Puedes confirmar la compra o retirar servicios antes de finalizar.</p>
        <ul class="list-group list-group-flush mb-3">${rows}</ul>
        <div class="d-flex justify-content-between align-items-center mb-3 text-white">
          <strong>Total:</strong>
          <span class="fs-5">${total.toLocaleString()} COP</span>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-brand" id="checkoutCart">Confirmar compra</button>
          <button class="btn btn-outline-brand" id="clearCart">Vaciar carrito</button>
        </div>
      </section>
    `;

    document.getElementById("checkoutCart").addEventListener("click", function () {
      const purchasesList = getPurchases();
      cart.forEach(item => {
        purchasesList.push({
          id: Date.now().toString() + item.serviceId,
          client: getCurrentUser().email,
          vendor: item.vendor,
          serviceId: item.serviceId,
          serviceTitle: item.title,
          price: item.price,
          status: "Pendiente",
          createdAt: new Date().toISOString(),
        });
      });
      savePurchases(purchasesList);
      clearCart();
      alert("Compra confirmada. Revisa tu historial de compras.");
      renderPurchases();
    });

    document.getElementById("clearCart").addEventListener("click", function () {
      clearCart();
      renderCart();
    });

    document.querySelectorAll(".remove-cart-item").forEach(button => {
      button.addEventListener("click", function () {
        removeFromCart(this.dataset.id);
        renderCart();
      });
    });
  }

  function renderPurchases() {
    const user = getCurrentUser();
    const purchases = getPurchasesByClient(user.email);
    if (purchases.length === 0) {
      content.innerHTML = `
        <div class="card bg-secondary-soft p-4">
          <h3 class="mb-4">Historial de compras</h3>
          <p>No has comprado servicios todavía.</p>
        </div>
      `;
      return;
    }

    const rows = purchases.map(purchase => `
      <tr>
        <td>${purchase.serviceTitle}</td>
        <td>${purchase.price.toLocaleString()} COP</td>
        <td>${purchase.status}</td>
        <td>${new Date(purchase.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join("");

    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Historial de compras</h3>
        <div class="table-responsive">
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderChat() {
    const user = getCurrentUser();
    const messages = getClientChats(user.email);

    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Chat con soporte</h3>
        <p>Escribe tu consulta y nuestro equipo responderá en el mismo panel.</p>
        <div class="chat-window mb-3" style="max-height: 320px; overflow-y: auto;">
          ${messages.length
            ? messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map(message => `
                  <div class="mb-3 ${message.sender === 'cliente' ? 'text-end' : ''}">
                    <span class="badge ${message.sender === 'cliente' ? 'bg-primary' : 'bg-secondary'}">${message.sender === 'cliente' ? 'Tú' : 'Soporte'}</span>
                    <p class="mb-0 small text-white">${escapeHtml(message.text)}</p>
                    <small class="text-muted">${new Date(message.createdAt).toLocaleString()}</small>
                  </div>
                `).join('')
            : '<p class="text-muted mb-0">Aún no hay mensajes. Escribe una consulta para comenzar.</p>'}
        </div>
        <form id="chatForm" class="d-flex flex-column flex-md-row gap-2">
          <textarea id="chatInput" class="form-control" rows="2" placeholder="Escribe tu duda o solicitud..." required></textarea>
          <button type="submit" class="btn btn-brand align-self-start">Enviar</button>
        </form>
      </div>
    `;

    const chatForm = document.getElementById("chatForm");
    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const text = document.getElementById("chatInput").value.trim();
      if (!text) return;

      addClientChat({ userEmail: user.email, sender: 'cliente', text });
      addClientChat({
        userEmail: user.email,
        sender: 'soporte',
        text: `Gracias por contactarnos, ${user.name}. Hemos recibido tu solicitud y te responderemos en breve desde el soporte de System Solution.`
      });

      renderChat();
    });
  }

  renderServices();
});
