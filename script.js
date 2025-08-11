let tools = JSON.parse(localStorage.getItem("tools")) || [];
let editIndex = null;

function normalizeCategory(cat) {
  return cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function saveTools() {
  localStorage.setItem("tools", JSON.stringify(tools));
}

function displayCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = '';

  // Bouton projets (redirige vers la page projets)
  const projectBtn = document.createElement("li");
  projectBtn.textContent = "📁 Projets";
  projectBtn.style.cursor = "pointer";
  projectBtn.onclick = () => window.location.href = "projet.html";
  list.appendChild(projectBtn);

  // Bouton afficher tous les outils
  const showAllBtn = document.createElement("li");
  showAllBtn.textContent = "Tous les outils";
  showAllBtn.style.cursor = "pointer";
  showAllBtn.onclick = () => displayTools(null);
  list.appendChild(showAllBtn);

  // Récupérer catégories uniques insensibles à la casse/accent
  const uniqueCategories = [...new Set(tools.map(t => normalizeCategory(t.category)))];
  const originalNames = {};
  tools.forEach(t => {
    const norm = normalizeCategory(t.category);
    if (!originalNames[norm]) originalNames[norm] = t.category;
  });

  uniqueCategories.forEach(catNorm => {
    const li = document.createElement("li");
    li.textContent = originalNames[catNorm];
    li.style.cursor = "pointer";
    li.onclick = () => displayTools(catNorm);
    list.appendChild(li);
  });
}

function displayTools(categoryFilter = null, searchKeyword = '') {
  const container = document.getElementById("toolsContainer");
  container.innerHTML = '';

  const keyword = searchKeyword.toLowerCase();

  tools
    .filter(tool => {
      if (categoryFilter && normalizeCategory(tool.category) !== categoryFilter) return false;
      if (keyword && !tool.name.toLowerCase().includes(keyword)) return false;
      return true;
    })
    .forEach((tool, index) => {
      const item = document.createElement("div");
      item.className = "tool-item";

      const title = document.createElement("div");
      title.className = "tool-title";
      title.textContent = tool.name;

      const details = document.createElement("div");
      details.className = "tool-details";
      details.style.display = "none";
      details.innerHTML = `
        <p><strong>Catégorie:</strong> ${tool.category}</p>
        <p><strong>Lien:</strong> <a href="${tool.link}" target="_blank">${tool.link}</a></p>
        <p><strong>Utilité:</strong> ${tool.usefulness}</p>
        <p><strong>Fonctionnement:</strong> ${tool.usage}</p>
      `;

      const actions = document.createElement("div");
      actions.className = "tool-actions";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Supprimer";
      deleteBtn.onclick = () => {
        if (confirm("Confirmer la suppression ?")) {
          tools.splice(index, 1);
          saveTools();
          displayTools(categoryFilter, searchKeyword);
          displayCategories();
        }
      };

      const editBtn = document.createElement("button");
      editBtn.textContent = "Modifier";
      editBtn.onclick = () => {
        document.getElementById("name").value = tool.name;
        document.getElementById("category").value = tool.category;
        document.getElementById("link").value = tool.link;
        document.getElementById("usefulness").value = tool.usefulness;
        document.getElementById("usage").value = tool.usage;
        editIndex = index;
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      details.appendChild(actions);

      title.onclick = () => {
        // masquer tous les autres détails sauf celui cliqué
        document.querySelectorAll(".tool-details").forEach(d => {
          if (d !== details) d.style.display = "none";
        });
        // toggle affichage détail courant
        details.style.display = details.style.display === "none" ? "block" : "none";
      };

      item.appendChild(title);
      item.appendChild(details);
      container.appendChild(item);
    });
}

document.getElementById("addToolForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const link = document.getElementById("link").value.trim();
  const usefulness = document.getElementById("usefulness").value.trim();
  const usage = document.getElementById("usage").value.trim();

  if (editIndex !== null) {
    tools[editIndex] = { name, category, link, usefulness, usage };
    editIndex = null;
  } else {
    tools.push({ name, category, link, usefulness, usage });
  }

  saveTools();
  displayTools();
  displayCategories();
  e.target.reset();
});

document.getElementById("search").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  displayTools(null, keyword);
});

// Affiche catégories + tous outils au chargement
displayCategories();
displayTools();
