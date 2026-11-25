/* Faro: interacción de la landing. Sin dependencias ni servicios externos. */
/* Añade aquí las URL públicas cuando estén listas. Deben comenzar con https://. */
const publicLinks = {
  store: "",
  direct: "",
  privacy: ""
};

const modules = {
  musica: {
    number: "01 / 08",
    title: "Tu música también tiene su lugar.",
    description: "Controla lo que escuchas sin cambiar de ventana. Sigue la letra sincronizada y deja que el visualizador acompañe el ritmo.",
    points: ["Spotify, Apple Music, YouTube Music y reproductores locales", "Letras sincronizadas y visualizador en tiempo real"],
    image: "img/modulo-musica.png",
    alt: "Módulo Música y Letras de Faro"
  },
  conversor: {
    number: "02 / 08",
    title: "Suelta un archivo. Sigue con lo tuyo.",
    description: "Arrastra archivos a la isla y conviértelos sin interrumpir tu trabajo. Faro se encarga del proceso en tu equipo.",
    points: ["Imágenes, PDF, documentos de Office y multimedia", "Conversión local con arrastrar y soltar"],
    image: "img/modulo-conversor.png",
    alt: "Conversor de archivos de Faro"
  },
  captura: {
    number: "03 / 08",
    title: "De la pantalla a una idea útil.",
    description: "Recorta, extrae texto con OCR local, traduce texto o capturas y graba la pantalla con controles flotantes.",
    points: ["Traducción en 15 idiomas, QR y cuentagotas de color", "Captura y grabación sin salir de tu flujo"],
    image: "img/modulo-captura.png",
    alt: "Herramientas de captura y OCR de Faro"
  },
  enfoque: {
    number: "04 / 08",
    title: "Un tiempo para avanzar. Otro para respirar.",
    description: "Organiza sesiones Pomodoro y descansos con el ritmo que mejor te funcione.",
    points: ["Modo Suave o Estricto", "Bloqueo opcional de aplicaciones y sitios distractores"],
    image: "img/modulo-enfoque.png",
    alt: "Temporizador Pomodoro de Faro"
  },
  agua: {
    number: "05 / 08",
    title: "Una pausa pequeña también cuenta.",
    description: "Recibe recordatorios de hidratación, registra lo que bebes y consulta tu avance sin abrir otra ventana.",
    points: ["Recordatorios inteligentes", "Registro diario y anillo de progreso en la isla"],
    image: "img/modulo-agua.png",
    alt: "Seguimiento de hidratación de Faro"
  },
  portapapeles: {
    number: "06 / 08",
    title: "Lo que copias, listo para volver.",
    description: "Recupera texto e imágenes del historial, guarda archivos temporalmente en el Estante y compártelos con tu móvil.",
    points: ["Pegado sin formato con Ctrl + Alt + V", "Envío por QR en la misma Wi-Fi, sin subir archivos"],
    image: "img/modulo-portapapeles.png",
    alt: "Portapapeles y Estante de Faro"
  },
  notas: {
    number: "07 / 08",
    title: "Anótalo antes de que se escape.",
    description: "Escribe notas rápidas, mira el calendario mensual y crea recordatorios locales desde el mismo lugar.",
    points: ["Notas siempre a mano", "Calendario y recordatorios locales"],
    image: "img/modulo-notas.png",
    alt: "Notas y calendario de Faro"
  },
  sistema: {
    number: "08 / 08",
    title: "Tu equipo, a simple vista.",
    description: "Consulta avisos de Windows, el estado del equipo y los controles que sueles necesitar durante el día.",
    points: ["Centro de notificaciones y monitor de CPU/RAM", "Audio, brillo, energía y clima local"],
    image: "img/modulo-sistema.png",
    alt: "Panel de sistema de Faro"
  }
};

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function updateThemeButton(theme) {
  const label = theme === "dark" ? "Activar tema claro" : "Activar tema oscuro";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}

updateThemeButton(root.dataset.theme);

themeButton.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  updateThemeButton(next);
  themeMeta?.setAttribute("content", next === "dark" ? "#161e2e" : "#f7f6f2");
  try {
    localStorage.setItem("faro-theme", next);
  } catch {
    // La preferencia sigue activa durante esta visita.
  }
});

function loadSlot(slot) {
  const path = slot.dataset.image;
  if (!path) return;
  slot.querySelector("img")?.remove();
  slot.classList.remove("has-image");
  const image = new Image();
  image.alt = slot.dataset.alt || slot.getAttribute("aria-label") || "Imagen de Faro";
  image.loading = "eager";
  image.decoding = "async";
  image.onload = () => {
    if (slot.dataset.image !== path) return;
    slot.prepend(image);
    slot.classList.add("has-image");
  };
  image.src = path;
}

document.querySelectorAll(".image-slot").forEach(loadSlot);

const tabs = [...document.querySelectorAll(".module-tab")];
const panel = document.querySelector("#module-panel");
const moduleImage = panel.querySelector(".module-image");

function selectModule(tab, focus = false) {
  const item = modules[tab.dataset.module];
  if (!item) return;
  tabs.forEach((candidate) => {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", tab.id);
  document.querySelector("#module-count").textContent = item.number;
  document.querySelector("#module-title").textContent = item.title;
  document.querySelector("#module-description").textContent = item.description;
  const list = document.querySelector("#module-points");
  list.replaceChildren(...item.points.map((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    return li;
  }));
  moduleImage.dataset.image = item.image;
  moduleImage.dataset.alt = item.alt;
  moduleImage.setAttribute("aria-label", `Captura de ${tab.textContent}`);
  moduleImage.querySelector("code").textContent = item.image;
  loadSlot(moduleImage);
  if (focus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectModule(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectModule(tabs[next], true);
    tabs[next].scrollIntoView({ block: "nearest", inline: "nearest" });
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const toast = document.querySelector("#link-toast");
let toastTimer;
const linkTargets = { store: "#store-link", direct: "#direct-link", privacy: "#privacy-link" };
Object.entries(linkTargets).forEach(([key, selector]) => {
  const url = publicLinks[key];
  if (!/^https:\/\/[^\s]+$/i.test(url)) return;
  const link = document.querySelector(selector);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.removeAttribute("data-pending");
  link.classList.remove("pending-link");
});
if (publicLinks.store && publicLinks.direct) {
  document.querySelector("#download-note").textContent = "Las descargas se abrirán en una pestaña nueva.";
}
document.querySelectorAll("[data-pending]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    toast.textContent = `El enlace de ${link.dataset.pending} estará disponible cuando se publique.`;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4200);
  });
});
