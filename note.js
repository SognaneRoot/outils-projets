const categoryList = document.getElementById('categoryList');
const addNoteBtn = document.getElementById('addNoteBtn');
const editableNote = document.getElementById('editableNote');
const currentTitle = document.getElementById('currentTitle');

let currentCategory = null;

// Charger les catégories depuis localStorage
function loadCategories() {
  categoryList.innerHTML = '';
  const keys = Object.keys(localStorage).filter(k => k.startsWith('note_'));
  keys.forEach(key => {
    const title = key.replace('note_', '');
    const li = document.createElement('li');
    li.textContent = title;
    li.onclick = () => loadNote(title, li);
    categoryList.appendChild(li);
  });
}

// Charger une note existante
function loadNote(title, element) {
  // Mettre à jour les styles actifs
  [...categoryList.children].forEach(li => li.classList.remove('active'));
  element.classList.add('active');

  currentCategory = title;
  currentTitle.textContent = title;
  editableNote.style.display = 'block';
  editableNote.textContent = localStorage.getItem('note_' + title) || '';

  editableNote.oninput = () => {
    localStorage.setItem('note_' + currentCategory, editableNote.textContent);
  };
}

// Ajouter une nouvelle note
addNoteBtn.onclick = () => {
  const title = prompt("Titre de la nouvelle note :").trim();
  if (!title) return;

  const key = 'note_' + title.toLowerCase();
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, '');
    loadCategories();
  }

  // Charger immédiatement
  const items = [...categoryList.children];
  const item = items.find(li => li.textContent === title);
  if (item) loadNote(title, item);
};

loadCategories();
