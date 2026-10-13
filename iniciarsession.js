document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginRoleInput = document.getElementById("loginRole");
  const roleButtons = document.querySelectorAll(".role-option");

  if (roleButtons.length) {
    roleButtons.forEach(button => {
      button.addEventListener("click", function () {
        roleButtons.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        loginRoleInput.value = this.dataset.role;
      });
    });
  }

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const role = loginRoleInput.value;
    if (!email) {
      alert("Por favor ingresa tu correo.");
      return;
    }
    if (!password) {
      alert("Por favor ingresa tu contraseña.");
      return;
    }
    if (!role) {
      alert("Selecciona tu rol para continuar.");
      return;
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password || user.role !== role) {
      alert("Usuario no encontrado o rol/contraseña incorrectos.");
      return;
    }

    setSession({ email: user.email });
    window.location.href = `${role}.html`;
  });
});
