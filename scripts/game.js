// Инициализация переменных
let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;
let upgradeCost = 50;  // Стоимость улучшений
let upgradeMultiplier = 1; // Множитель кликов

// Получаем элементы с DOM
const counterElement = document.getElementById("counter");
const upgradeButton = document.getElementById("upgradeButton");
const egg = document.getElementById("egg");

// Функция обновления счетчика
function updateCounter() {
  counterElement.textContent = counter; // Обновляем счетчик на странице
  localStorage.setItem('counter', counter); // Сохраняем в localStorage
}

// Логика для кликов по яйцу
egg.addEventListener("click", function() {
  counter += upgradeMultiplier; // Увеличиваем счет на множитель кликов
  updateCounter(); // Обновляем отображение счета
});

// Логика магазина (покупка улучшений)
upgradeButton.addEventListener("click", function() {
  if (counter >= upgradeCost) {
    counter -= upgradeCost; // Уменьшаем количество очков за улучшение
    upgradeMultiplier++; // Увеличиваем множитель
    upgradeCost = Math.floor(upgradeCost * 1.5); // Увеличиваем стоимость следующего улучшения
    updateCounter(); // Обновляем отображение счета
    alert(`Множитель увеличен! Теперь за клик вы получаете ${upgradeMultiplier} очков.`);
    upgradeButton.textContent = `Увеличить на ${upgradeMultiplier} за ${upgradeCost} очков`; // Обновляем текст кнопки
  } else {
    alert("Недостаточно очков для улучшения!");
  }
});

// Инициализация начальных значений
updateCounter();

