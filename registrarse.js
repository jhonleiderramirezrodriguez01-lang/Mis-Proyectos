document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.getElementById("registerForm");
  const regRoleInput = document.getElementById("regRole");
  const roleButtons = document.querySelectorAll(".role-option");

  if (roleButtons.length) {
    roleButtons.forEach(button => {
      button.addEventListener("click", function () {
        roleButtons.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        regRoleInput.value = this.dataset.role;
      });
    });
  }

  if (!regForm) return;

  regForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("regNombre").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const role = regRoleInput.value;

    if (!name) {
      alert("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!email) {
      alert("Por favor ingresa tu correo.");
      return;
    }
    if (!password) {
      alert("Por favor ingresa tu contraseña.");
      return;
    }
    if (!role) {
      alert("Selecciona un rol para continuar.");
      return;
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      alert("Ya existe una cuenta con ese correo.");
      return;
    }

    const user = createUser({ name, email, password, role });
    if (!user) {
      alert("No se pudo crear la cuenta. Intenta nuevamente.");
      return;
    }

    setSession({ email: user.email });
    window.location.href = `${role}.html`;
  });
});
