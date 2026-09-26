const STORAGE_KEY = 'taskflow.tasks';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const form = $('#addForm');
const input = $('#taskInput');
const prioritySelect = $('#prioritySelect');
const list = $('#list');
const emptyMsg = $('#empty');
const countEl = $('#count');
const clearDoneBtn = $('#clearDone');
const filterBtns = $$('.filters button');

let tasks = load();
let filter = 'all';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — app still works for this session
  }
}

function uid() {
  return (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random());
}

function visibleTasks() {
  if (filter === 'active') return tasks.filter(t => !t.done);
  if (filter === 'done') return tasks.filter(t => t.done);
  return tasks;
}

function render() {
  const items = visibleTasks();
  list.innerHTML = '';

  items.forEach(task => {
    const li = document.createElement('li');
    li.className = 'item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = task.text;
    text.title = 'Double-click to edit';

    const chip = document.createElement('span');
    chip.className = 'chip ' + task.priority;
    chip.textContent = task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' : 'Medium';

    const del = document.createElement('button');
    del.className = 'del';
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete task');
    del.textContent = '×';

    li.append(checkbox, text, chip, del);
    list.appendChild(li);
  });

  emptyMsg.hidden = items.length !== 0;

  const remaining = tasks.filter(t => !t.done).length;
  countEl.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({
    id: uid(),
    text,
    priority: prioritySelect.value,
    done: false,
    createdAt: Date.now()
  });
  input.value = '';
  save();
  render();
});

list.addEventListener('click', e => {
  const li = e.target.closest('.item');
  if (!li) return;
  const task = tasks.find(t => t.id === li.dataset.id);
  if (!task) return;

  if (e.target.matches('input[type="checkbox"]')) {
    task.done = e.target.checked;
    save();
    render();
  }
  if (e.target.matches('.del')) {
    tasks = tasks.filter(t => t.id !== task.id);
    save();
    render();
  }
});

list.addEventListener('dblclick', e => {
  const textEl = e.target.closest('.text');
  if (!textEl) return;
  const li = textEl.closest('.item');
  const task = tasks.find(t => t.id === li.dataset.id);
  if (!task) return;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = task.text;
  editInput.maxLength = 140;
  editInput.style.flex = '1';
  editInput.style.minWidth = '0';
  editInput.style.font = 'inherit';
  editInput.style.color = 'var(--tx)';
  editInput.style.background = 'rgba(255,255,255,.06)';
  editInput.style.border = '1px solid var(--line)';
  editInput.style.borderRadius = '8px';
  editInput.style.padding = '6px 10px';

  textEl.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  const commit = () => {
    const v = editInput.value.trim();
    if (v) task.text = v;
    save();
    render();
  };
  editInput.addEventListener('blur', commit);
  editInput.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') editInput.blur();
    if (ev.key === 'Escape') { editInput.value = task.text; editInput.blur(); }
  });
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.f;
    filterBtns.forEach(b => b.setAttribute('aria-pressed', b === btn));
    render();
  });
});

clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

render();
