document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (!user || user.role !== "administrador") {
    window.location.href = "iniciarsession.html";
    return;
  }

  const container = document.getElementById("perfilAdminContent");
  container.innerHTML = `
    <div class="card bg-secondary-soft p-4">
      <h3 class="mb-4">Editar perfil administrativo</h3>
      <form id="adminProfileForm">
        <div class="mb-3">
          <label class="form-label">Nombre completo</label>
          <input type="text" class="form-control" id="adminName" value="${user.name}" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" id="adminEmail" value="${user.email}" disabled>
        </div>
        <div class="mb-3">
          <label class="form-label">Nueva contraseña</label>
          <input type="password" class="form-control" id="adminPassword" placeholder="Deja vacío para mantener la actual">
        </div>
        <button type="submit" class="btn btn-brand">Guardar cambios</button>
      </form>
    </div>
  `;

  const form = document.getElementById("adminProfileForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("adminName").value.trim();
    const password = document.getElementById("adminPassword").value;
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
  });
});