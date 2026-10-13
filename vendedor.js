document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (!user || user.role !== "vendedor") {
    window.location.href = "iniciarsession.html";
    return;
  }

  const content = document.getElementById("vendorContent");
  const buttons = document.querySelectorAll(".action-btn");
  const headerDesc = document.querySelector(".section-desc");
  if (headerDesc) {
    headerDesc.textContent = `Hola ${user.name}, administra tus servicios y revisa las solicitudes de tus clientes.`;
  }

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      if (action === "Editar perfil") {
        renderProfile();
      } else if (action === "Subir servicio") {
        renderAddService();
      } else if (action === "Ver adquiridos") {
        renderVendorPurchases();
      } else if (action === "Abrir chat") {
        renderChat();
      }
    });
  });

  function renderProfile() {
    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Mi perfil</h3>
        <form id="vendorProfileForm">
          <div class="mb-3">
            <label class="form-label">Nombre completo</label>
            <input type="text" class="form-control" id="profileName" value="${user.name}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" id="profileEmail" value="${user.email}" disabled>
          </div>
          <div class="mb-3">
            <label class="form-label">Rol</label>
            <input type="text" class="form-control" value="${user.role}" disabled>
          </div>
          <div class="mb-4">
            <label class="form-label">Nueva contraseña</label>
            <input type="password" class="form-control" id="profilePassword" placeholder="Deja vacío para mantener la actual">
          </div>
          <button type="submit" class="btn btn-brand">Guardar cambios</button>
        </form>
      </div>
    `;

    const profileForm = document.getElementById("vendorProfileForm");
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
      alert("Perfil actualizado correctamente.");
      renderProfile();
    });
  }

  function renderAddService() {
    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Publicar servicio</h3>
        <form id="serviceForm">
          <div class="mb-3">
            <label class="form-label">Título del servicio</label>
            <input type="text" class="form-control" id="serviceTitle" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="serviceDescription" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Precio COP</label>
            <input type="number" class="form-control" id="servicePrice" min="0" required>
          </div>
          <button type="submit" class="btn btn-brand">Guardar servicio</button>
        </form>
      </div>
    `;

    const serviceForm = document.getElementById("serviceForm");
    serviceForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const title = document.getElementById("serviceTitle").value.trim();
      const description = document.getElementById("serviceDescription").value.trim();
      const price = Number(document.getElementById("servicePrice").value);

      if (!title || !description || !price) {
        alert("Completa todos los campos correctamente.");
        return;
      }

      const services = getServices();
      services.push({
        id: Date.now().toString(),
        title,
        description,
        price,
        vendor: user.email,
        createdAt: new Date().toISOString(),
      });
      saveServices(services);
      alert("Servicio agregado correctamente.");
      renderVendorServices();
    });
  }

  function renderVendorServices() {
    const services = getServicesByVendor(user.email);
    if (services.length === 0) {
      content.innerHTML = `
        <div class="card bg-secondary-soft p-4">
          <h3 class="mb-4">Mis servicios</h3>
          <p>No has publicado servicios todavía.</p>
        </div>
      `;
      return;
    }

    const items = services.map(service => `
      <div class="card p-3 mb-3">
        <h5>${service.title}</h5>
        <p>${service.description}</p>
        <p><strong>Precio:</strong> ${service.price.toLocaleString()} COP</p>
      </div>
    `).join("");

    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Mis servicios publicados</h3>
        ${items}
      </div>
    `;
  }

  function renderVendorPurchases() {
    const purchases = getPurchasesByVendor(user.email);
    if (purchases.length === 0) {
      content.innerHTML = `
        <div class="card bg-secondary-soft p-4">
          <h3 class="mb-4">Compras por tus servicios</h3>
          <p>No hay compras registradas para tus servicios.</p>
        </div>
      `;
      return;
    }

    const rows = purchases.map(purchase => `
      <tr>
        <td>${purchase.serviceTitle}</td>
        <td>${purchase.client}</td>
        <td>${purchase.price.toLocaleString()} COP</td>
        <td>${purchase.status}</td>
        <td>${new Date(purchase.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join("");

    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Servicios adquiridos</h3>
        <div class="table-responsive">
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Cliente</th>
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
    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Chat con clientes</h3>
        <p>Puedes coordinar pedidos y entregas con tus clientes desde esta plataforma.</p>
        <p>Envía un correo a <strong>ventas@systemsolution.com</strong> si necesitas soporte adicional.</p>
      </div>
    `;
  }
});
