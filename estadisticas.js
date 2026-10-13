document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (!user || user.role !== "administrador") {
    window.location.href = "iniciarsession.html";
    return;
  }

  const stats = getStats();
  const container = document.getElementById("estadisticasContent");

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <div class="stat-card p-4">
          <h3>${stats.totalUsers}</h3>
          <p>Usuarios totales</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="stat-card p-4">
          <h3>${stats.totalClientes}</h3>
          <p>Clientes</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="stat-card p-4">
          <h3>${stats.totalVendedores}</h3>
          <p>Vendedores</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="stat-card p-4">
          <h3>${stats.totalServicios}</h3>
          <p>Servicios publicados</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="stat-card p-4">
          <h3>${stats.totalCompras}</h3>
          <p>Compras realizadas</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="stat-card p-4">
          <h3>${stats.totalIngresos.toLocaleString()} COP</h3>
          <p>Ingresos totales</p>
        </div>
      </div>
    </div>
  `;
});