const membersList = document.getElementById('membersList');
const addMemberForm = document.getElementById('addMemberForm');
const memberNameInput = document.getElementById('memberName');
const memberRoleInput = document.getElementById('memberRole');

// Пример данных участников
let members = [
  { name: 'User1', role: 'Admin' },
  { name: 'User2', role: 'Member' }
];

// Функция для отображения списка участников
function displayMembers() {
  membersList.innerHTML = '';
  members.forEach(member => {
    const li = document.createElement('li');
    li.textContent = `${member.name} - ${member.role}`;
    membersList.appendChild(li);
  });
}

// Обработчик формы добавления нового участника
addMemberForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newMember = {
    name: memberNameInput.value,
    role: memberRoleInput.value
  };
  members.push(newMember);
  memberNameInput.value = '';
  memberRoleInput.value = 'Member';
  displayMembers();
});

// Изначально отобразим участников
displayMembers();
