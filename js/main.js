//Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");
let tasks = [];
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}
checkEmptiList();
//Добавление задачи
form.addEventListener("submit", addTask);
//Удаление задачи
tasksList.addEventListener("click", deleteTask);
//отмечем задачу завершенной
tasksList.addEventListener("click", doneTask);
//функции
function addTask(event) {
  //отменяем отправку формы
  event.preventDefault();
  //достанем текст задачи из поля ввода
  const taskText = taskInput.value;
  //Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  //добавляем задачу в массив с задачами
  tasks.push(newTask);
  //добавляем список задач в хранилище браузера LocalStorage
  saveToLocalStorage();
  renderTask(newTask);
  //Очищаем поля ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();
  checkEmptiList();
}
function deleteTask(event) {
  //Проверяем если клик был НE по кнопке 'удалить задачу'
  if (event.target.dataset.action !== "delete") return;
  //Проверяем что клик был по кнопке "удалить задачу"
  const parenNode = event.target.closest(".list-group-item");
  //Определяем ID задачи
  const id = Number(parenNode.id);
  //удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();
  //Удаляем задачу из разметки
  parenNode.remove();
  checkEmptiList();
}
function doneTask(event) {
  //Проверяем, что клик был по кнопке 'задача выполнена'
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest(".list-group-item");
  //Определяем ID задачи
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  saveToLocalStorage();
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}
function checkEmptiList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
		<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
		<div class="empty-list__title">Список дел пуст</div>
	</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTask(task) {
  //формируем CSS класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";
  //Формируем разметку для новой задачи
  const taskHTML = `
		<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
	<span class="${cssClass}">${task.text}</span>
	<div class="task-item__buttons">
		<button type="button" data-action="done" class="btn-action">
			<img src="./img/tick.svg" alt="Done" width="18" height="18" />
		</button>
		<button type="button" data-action="delete" class="btn-action">
			<img src="./img/cross.svg" alt="Done" width="18" height="18" />
		</button>
	</div>
</li>`;
  // Добавляем задачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
