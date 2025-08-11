let projets = JSON.parse(localStorage.getItem("projets")) || [];

function saveProjets() {
  localStorage.setItem("projets", JSON.stringify(projets));
}

function displayProjets() {
  const container = document.getElementById("projetList");
  container.innerHTML = "";

  projets.forEach((proj, index) => {
    const div = document.createElement("div");
    div.className = "projet";

    const nom = document.createElement("h3");
    nom.textContent = proj.nom;
    nom.style.cursor = "pointer";

    const bloc = document.createElement("div");
    bloc.className = "projet-details";

    bloc.innerHTML = `
      <p><strong>Fichier :</strong> <a href="${proj.fichier}" target="_blank">${proj.fichierName}</a></p>
      <p><strong>Note :</strong> ${proj.note || "Aucune"}</p>
      <button onclick="editProjet(${index})">✏️ Modifier</button>
      <button onclick="deleteProjet(${index})">🗑️ Supprimer</button>
    `;

    div.appendChild(nom);
    div.appendChild(bloc);
    container.appendChild(div);
  });
}

function addProjet() {
  const nom = document.getElementById("projetNom").value.trim();
  const fichierInput = document.getElementById("projetFichier");
  const note = document.getElementById("projetNote").value.trim();

  if (!nom || !fichierInput.files[0]) {
    alert("Nom et fichier requis");
    return;
  }

  const fichier = URL.createObjectURL(fichierInput.files[0]);
  const fichierName = fichierInput.files[0].name;

  projets.push({ nom, fichier, fichierName, note });
  saveProjets();
  displayProjets();
  document.getElementById("projetForm").reset();
}

function deleteProjet(index) {
  if (confirm("Confirmer la suppression du projet ?")) {
    projets.splice(index, 1);
    saveProjets();
    displayProjets();
  }
}

function editProjet(index) {
  const proj = projets[index];
  const container = document.querySelectorAll(".projet")[index];

  container.innerHTML = `
    <input id="edit-nom" value="${proj.nom}" />
    <input id="edit-file" type="file" />
    <textarea id="edit-note">${proj.note || ''}</textarea>
    <button onclick="saveEditProjet(${index})">💾 Enregistrer</button>
  `;
}

function saveEditProjet(index) {
  const nom = document.getElementById("edit-nom").value.trim();
  const fichierInput = document.getElementById("edit-file");
  const note = document.getElementById("edit-note").value.trim();

  let fichier = projets[index].fichier;
  let fichierName = projets[index].fichierName;

  if (fichierInput.files[0]) {
    fichier = URL.createObjectURL(fichierInput.files[0]);
    fichierName = fichierInput.files[0].name;
  }

  projets[index] = { nom, fichier, fichierName, note };
  saveProjets();
  displayProjets();
}

window.onload = () => {
  displayProjets();
  document.getElementById("projetForm").addEventListener("submit", e => {
    e.preventDefault();
    addProjet();
  });

  document.getElementById("retourBtn").onclick = () => {
    window.location.href = "index.html";
  };
};
