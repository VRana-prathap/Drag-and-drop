let boardData = JSON.parse(localStorage.getItem('kanbanBoard')) || {
  todo: [],
  inprogress: [],
  done: []
};

const lists = document.querySelectorAll('.list');
const taskInput = document.querySelector('.task-input');
const addBtn = document.querySelector('.add-btn');

function renderBoard() {
  lists.forEach(list => {
    const listId = list.id;
    const container = list.querySelector('.cards');
    container.innerHTML = '';

    const tasks = boardData[listId] || [];
    tasks.forEach((text, i) => {
      const card = createCard(text, `${listId}-card-${i}`);
      container.appendChild(card);
    });
  });
}

function createCard(text, id) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.id = id;
  card.textContent = text.trim();

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '×';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    card.remove();
    updateAndSave();
  };

  card.appendChild(deleteBtn);

  card.addEventListener('dragstart', () => {
    card.style.opacity = '0.7';
  });
  card.addEventListener('dragend', () => {
    card.style.opacity = '1';
  });

  return card;
}

function updateAndSave() {
  boardData = { todo: [], inprogress: [], done: [] };
  document.querySelectorAll('.list').forEach(list => {
    const id = list.id;
    list.querySelectorAll('.card').forEach(card => {
      const text = card.textContent.replace('×', '').trim();
      if (text) boardData[id].push(text);
    });
  });
  localStorage.setItem('kanbanBoard', JSON.stringify(boardData));
}

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    boardData.todo.push(text);
    saveAndRender();
    taskInput.value = '';
    taskInput.focus();
  }
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

document.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('card')) {
    e.dataTransfer.setData('text/plain', e.target.id);
  }
});

lists.forEach(list => {
  list.addEventListener('dragover', (e) => e.preventDefault());
  list.addEventListener('dragenter', (e) => {
    e.preventDefault();
    list.classList.add('over');
  });
  list.addEventListener('dragleave', () => {
    list.classList.remove('over');
  });
  list.addEventListener('drop', (e) => {
    e.preventDefault();
    list.classList.remove('over');
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    if (draggable) {
      list.querySelector('.cards').appendChild(draggable);
      updateAndSave();
    }
  });
});

function saveAndRender() {
  localStorage.setItem('kanbanBoard', JSON.stringify(boardData));
  renderBoard();
}

renderBoard();
taskInput.focus();
