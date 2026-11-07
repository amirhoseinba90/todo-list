const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const inputInvalid = document.getElementById("input-invalid");
const listItems = document.getElementById("list-items");
const clearBtn = document.getElementById("clear-btn");
const filter = document.getElementById("filter");
const editBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => additemToDOM(item));

  checkUI();
}

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if (newItem == "") {
    inputInvalid.innerText = "Please add an item";
    return;
  } else {
    inputInvalid.innerText = "";
  }

  if (isEditMode) {
    const itemToEdit = listItems.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
    editBtn.innerHTML = "<i class = 'bi bi-plus-lg'></i> Add Item";
    editBtn.classList.replace("edit-btn", "btn");
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      inputInvalid.innerText = "This item already exists!";
      return;
    } else {
      inputInvalid.innerText = "";
    }
  }

  additemToDOM(newItem);
  addItemToStorage(newItem);

  itemInput.value = "";

  checkUI();
}

function checkIfItemExists(item) {
  const itemFromStorage = getItemsFromStorage();
  return itemFromStorage.includes(item);
}

function additemToDOM(item) {
  const li = document.createElement("li");
  li.className = "list-item";
  li.textContent = item;

  const icon = document.createElement("i");
  icon.className = "bi bi-x";

  li.appendChild(icon);

  listItems.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.classList.contains("bi-x")) {
    removeItem(e.target.parentElement);
  } else {
    editMode(e.target);
  }
}

function editMode(item) {
  isEditMode = true;
  listItems
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  itemInput.value = item.textContent;
  editBtn.innerHTML = "<i class = 'bi bi-pencil-fill'></i> Edit Item";
  editBtn.classList.replace("btn", "edit-btn");
}

function removeItem(item) {
  item.remove();
  removeItemFromStorage(item.textContent);
  checkUI();
}

function clearItems() {
  listItems.innerHTML = "";
  localStorage.removeItem("items");
  checkUI();
}

function removeItemFromStorage(item) {
  let itemFromStorage = getItemsFromStorage();

  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(itemFromStorage));

  console.log(itemFromStorage);
}

function checkUI() {
  const items = listItems.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    filter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filter.style.display = "block";
  }
}

function filterItems(e) {
  const items = listItems.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

itemForm.addEventListener("submit", addItem);
listItems.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearItems);
filter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems);

checkUI();
