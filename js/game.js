// Инициализация переменных
let playerName = "Гость";
let playerLevel = 1;
let playerClicks = 0;
let weaponEquipped = false;
let armorEquipped = false;
let clanName = null;
let clanMembers = [];

// Получаем элементы на странице
const playerNameElement = document.getElementById("playerName");
const playerLevelElement = document.getElementById("playerLevel");
const playerClicksElement = document.getElementById("playerClicks");
const eggElement = document.getElementById("egg");
const buyWeaponButton = document.getElementById("buyWeapon");
const buyArmorButton = document.getElementById("buyArmor");
const createClanButton = document.getElementById("createClan");
const joinClanButton = document.getElementById("joinClan");
const clanNameElement = document.getElementById("clanName");
const fightClanButton = document.getElementById("fightClan");

// Обновление профиля игрока
function updateProfile() {
  playerNameElement.textContent = `Имя: ${playerName}`;
  playerLevelElement.textContent = `Уровень: ${playerLevel}`;
  playerClicksElement.textContent = `Клики: ${playerClicks}`;
}

// Обработчик кликов по яйцу
eggElement.addEventListener("click", function() {
  playerClicks += 1;
  updateProfile();
});

// Логика покупки оружия
buyWeaponButton.addEventListener("click", function() {
  if (playerClicks >= 100) {
    playerClicks -= 100;
    weaponEquipped = true;
    updateProfile();
    alert("Меч куплен!");
  } else {
    alert("Недостаточно кликов для покупки меча!");
  }
});

// Логика покупки брони
buyArmorButton.addEventListener("click", function() {
  if (playerClicks >= 200) {
    playerClicks -= 200;
    armorEquipped = true;
    updateProfile();
    alert("Броня куплена!");
  } else {
    alert("Недостаточно кликов для покупки брони!");
  }
});

// Логика создания клана
createClanButton.addEventListener("click", function() {
  if (!clanName) {
    clanName = prompt("Введите имя для клана:");
    clanNameElement.textContent = clanName;
    alert(`Клан "${clanName}" создан!`);
  } else {
    alert("У вас уже есть клан!");
  }
});

// Логика присоединения к клану
joinClanButton.addEventListener("click", function() {
  if (!clanName) {
    alert("Присоединитесь к клану!");
  } else {
    clanMembers.push(playerName);
    alert(`Вы присоединились к клану "${clanName}"!`);
  }
});

// Логика битвы с кланом
fightClanButton.addEventListener("click", function() {
  if (clanMembers.length > 0) {
    alert("Сражение с кланом началось!");
    // Можно добавить логику битвы, например, победу или поражение
  } else {
    alert("Присоединитесь к клану, чтобы сражаться!");
  }
});

// Инициализация профиля при загрузке страницы
updateProfile();
