const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

const STORAGE_KEY = 'expenseTrackerTransactions';

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function genId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function updateLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function addTransactionDOM(tx) {
  const sign = tx.type === 'expense' ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(tx.type);
  item.innerHTML = `
    <div>
      <strong>${tx.text}</strong>
    </div>
    <div>
      ${sign}₹${Math.abs(tx.amount).toFixed(2)}
    </div>
  `;
  listEl.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(tx => tx.amount);

  const total = amounts.reduce((acc, num) => acc + num, 0);
  const income = amounts.filter(x => x > 0).reduce((acc, n) => acc + n, 0);
  const expense = amounts.filter(x => x < 0).reduce((acc, n) => acc + n, 0);

  balanceEl.innerText = `₹${total.toFixed(2)}`;
  moneyPlusEl.innerText = `₹${income.toFixed(2)}`;
  moneyMinusEl.innerText = `₹${Math.abs(expense).toFixed(2)}`;
}

function init() {
  listEl.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', e => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Enter a description and amount!');
    return;
  }

  const amt = parseFloat(amount.value);
  const txType = type.value;

  const transaction = {
    id: genId(),
    text: text.value,
    amount: txType === 'expense' ? -Math.abs(amt) : Math.abs(amt),
    type: txType
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = '';
  amount.value = '';
  type.value = 'income';
});

