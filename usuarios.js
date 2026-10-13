document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (!user || user.role !== "administrador") {
    window.location.href = "iniciarsession.html";
    return;
  }

  const container = document.getElementById("usuariosContent");

  function renderUsers() {
    const users = getUsers();
    if (users.length === 0) {
      container.innerHTML = "<p>No hay usuarios registrados.</p>";
      return;
    }

    const rows = users.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>
          <select class="form-select form-select-sm role-select" data-email="${u.email}">
            <option value="cliente" ${u.role === "cliente" ? "selected" : ""}>Cliente</option>
            <option value="vendedor" ${u.role === "vendedor" ? "selected" : ""}>Vendedor</option>
            <option value="administrador" ${u.role === "administrador" ? "selected" : ""}>Administrador</option>
          </select>
        </td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        <td><button class="btn btn-sm btn-danger delete-user" data-email="${u.email}">Eliminar</button></td>
      </tr>
    `).join("");

    container.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Usuarios registrados</h3>
        <div class="table-responsive">
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;

    document.querySelectorAll(".role-select").forEach(select => {
      select.addEventListener("change", function () {
        const email = this.dataset.email;
        const user = findUserByEmail(email);
        if (!user) return;
        user.role = this.value;
        updateUser(user);
        alert("Rol actualizado correctamente.");
      });
    });

    document.querySelectorAll(".delete-user").forEach(button => {
      button.addEventListener("click", function () {
        const email = this.dataset.email;
        if (email === user.email) {
          alert("No puedes eliminar tu propia cuenta.");
          return;
        }
        if (!confirm(`¿Eliminar usuario ${email}?`)) return;
        removeUser(email);
        renderUsers();
      });
    });
  }

  renderUsers();
});