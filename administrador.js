document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (!user || user.role !== "administrador") {
    window.location.href = "iniciarsession.html";
    return;
  }

  const content = document.getElementById("adminContent");
  const buttons = document.querySelectorAll(".action-btn");
  const headerDesc = document.querySelector(".section-desc");
  if (headerDesc) {
    headerDesc.textContent = `Hola ${user.name}, gestiona usuarios, revisa estadísticas y actualiza tus datos administrativos.`;
  }

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      if (action === "Gestionar usuarios") {
        window.location.href = "usuarios.html";
      } else if (action === "Ver estadísticas") {
        window.location.href = "estadisticas.html";
      } else if (action === "Editar perfil") {
        window.location.href = "perfiladmin.html";
      } else if (action === "Abrir chat") {
        renderChat();
      }
    });
  });

  function renderChat() {
    content.innerHTML = `
      <div class="card bg-secondary-soft p-4">
        <h3 class="mb-4">Chat administrativo</h3>
        <p>Para solicitudes de plataforma, contacta con soporte técnico.</p>
        <ul>
          <li>Correo: <strong>admin-support@systemsolution.com</strong></li>
          <li>Teléfono: <strong>+57 300 456 7890</strong></li>
        </ul>
      </div>
    `;
  }
});
