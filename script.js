function navegar(seccion, elemento) {
      document.querySelectorAll('.pantalla').forEach(p => {
        p.classList.remove('pantalla-activa');
      });

      document.getElementById('seccion-' + seccion).classList.add('pantalla-activa');

      document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('activo');
      });

      elemento.classList.add('activo');

      if (window.innerWidth <= 920) {
        document.getElementById("nav-links").classList.remove("show");
      }
    }

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
    menuToggle.addEventListener("blur",)
 