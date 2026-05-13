let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const noteInput = document.getElementById('note');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');

dateInput.value = new Date().toISOString().split('T')[0];

function saveData() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction() {
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const note = noteInput.value.trim();
  const type = typeInput.value;
  const category = categoryInput.value;

  if (isNaN(amount) || amount <= 0) {
    alert('Enter a valid amount.');
    return;
  }
  if (!date) {
    alert('Select a date.');
    return;
  }

  transactions.push({
    id: Date.now(),
    type,
    amount,
    date,
    category,
    note
  });

  saveData();
  renderAll();
  amountInput.value = '';
  noteInput.value = '';
  dateInput.value = new Date().toISOString().split('T')[0];
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  renderAll();
}

function clearAll() {
  if (confirm('Delete all transactions?')) {
    transactions = [];
    saveData();
    renderAll();
  }
}

function formatMoney(value) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderStats() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, b) => a + b.amount, 0);

  const savings = income - expense;

  document.getElementById('incomeTotal').textContent = formatMoney(income);
  document.getElementById('expenseTotal').textContent = formatMoney(expense);
  document.getElementById('savingsTotal').textContent = formatMoney(savings);
}

function renderTable() {
  const body = document.getElementById('tableBody');
  body.innerHTML = '';

  if (transactions.length === 0) {
    body.innerHTML = '<tr><td colspan="6">No transactions added yet.</td></tr>';
    return;
  }

  transactions.slice().reverse().forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.type}</td>
      <td>${t.date}</td>
      <td>${t.category}</td>
      <td>${formatMoney(t.amount)}</td>
      <td>${t.note || '-'}</td>
      <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button></td>
    `;
    body.appendChild(row);
  });
}

function renderReport() {
  const report = document.getElementById('report');
  const expenses = transactions.filter(t => t.type === 'expense');

  if (expenses.length === 0) {
    report.innerHTML = '<p>No expense data available.</p>';
    return;
  }

  const totals = {};
  expenses.forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const topCategory = entries[0][0];

  report.innerHTML =
    entries.map(([cat, amt]) => `
      <div class="report-item">
        <span>${cat}</span>
        <strong>${formatMoney(amt)}</strong>
      </div>
    `).join('') +
    `<p><strong>Top Spending Category:</strong> ${topCategory}</p>`;
}

function renderAll() {
  renderStats();
  renderTable();
  renderReport();
}

renderAll();
