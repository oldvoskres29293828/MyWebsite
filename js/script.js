// Инициализация данных из локального хранилища
let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;
let upgradeCost = 50;
let upgradeMultiplier = 1;

// Обновление на странице
const counterElement = document.getElementById("counter");
const upgradeButton = document.getElementById("upgradeButton");
const egg = document.getElementById("egg");

// Обновление счетчика на странице
function updateCounter() {
  counterElement.textContent = counter;
  localStorage.setItem('counter', counter);
}

// Логика кликов
egg.addEventListener("click", function() {
  counter++;
  updateCounter();
});

// Логика магазина (улучшение)
upgradeButton.addEventListener("click", function() {
  if (counter >= upgradeCost) {
    counter -= upgradeCost;
    upgradeMultiplier++;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    updateCounter();
    alert(`Множитель увеличен! Теперь за клик вы получаете ${upgradeMultiplier} очков.`);
    upgradeButton.textContent = `Увеличить на ${upgradeMultiplier} за ${upgradeCost} очков`;
  } else {
    alert("Недостаточно очков для улучшения!");
  }
});

// Логика rebirth (сброс с бонусом)
document.getElementById("rebirthButton").addEventListener("click", function() {
  counter = 0;
  upgradeMultiplier = 1;
  updateCounter();
  alert("Игра сброшена. Вы получили бонус на улучшения!");
});

// Инициализация начальных значений
updateCounter();
