document.addEventListener('DOMContentLoaded', function () {
  const caretakerNameInput = document.getElementById('caretakerName');
  const tableContainer = document.getElementById('tableContainer');
  const caretakerData = {};

  caretakerNameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      const caretakerName = caretakerNameInput.value.trim();

      if (caretakerName !== '') {
        createTable(caretakerName);
        caretakerNameInput.value = '';
      }
    }
  });

  function createTable(caretakerName) {
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('tableWrapper');

    const caretakerLabel = document.createElement('h2');
    caretakerLabel.textContent = `Tabela dla opiekuna: ${caretakerName}`;
    tableWrapper.appendChild(caretakerLabel);

    const table = document.createElement('table');
    const headerRow = table.insertRow(0);
    headerRow.insertCell(0).textContent = 'Podopieczny';

    for (let i = 1; i <= 5; i++) {
      const dayOfWeek = getDayOfWeek(i);
      const headerCell = headerRow.insertCell(i);
      headerCell.textContent = dayOfWeek;
      headerCell.classList.add('total'); // Dodaj klasę dla sumy godzin pod każdym dniem
    }

    tableWrapper.appendChild(table);

    const podopiecznyInput = document.createElement('input');
    podopiecznyInput.setAttribute('type', 'text');
    podopiecznyInput.setAttribute(
      'placeholder',
      'Wprowadź nazwisko podopiecznego'
    );
    tableWrapper.appendChild(podopiecznyInput);

    podopiecznyInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        const podopiecznyName = podopiecznyInput.value.trim();

        if (podopiecznyName !== '') {
          if (!caretakerData[caretakerName]) {
            caretakerData[caretakerName] = {
              days: {},
            };
          }

          const row = table.insertRow(-1);
          row.insertCell(0).textContent = podopiecznyName;

          for (let i = 1; i <= 5; i++) {
            const cell = row.insertCell(i);
            const input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('step', '0.5');
            input.setAttribute('min', '0');
            input.value = '0';
            cell.appendChild(input);

            input.addEventListener('input', function () {
              updateTotalHours(caretakerName, table);
            });
          }

          podopiecznyInput.value = '';
        }
      }
    });

    tableContainer.appendChild(tableWrapper);
  }

  function getDayOfWeek(dayIndex) {
    const daysOfWeek = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt'];
    return daysOfWeek[dayIndex - 1];
  }

  function updateTotalHours(caretakerName, table) {
    const totalTable = createTotalTableIfNotExists(caretakerName);

    const tableRows = Array.from(
      table.querySelectorAll('tr:not(:first-child)')
    );

    for (let i = 1; i <= 5; i++) {
      let totalHoursColumn = 0;

      tableRows.forEach((row) => {
        const cell = row.cells[i];
        const input = cell.querySelector('input[type="number"]');
        const hours = parseFloat(input.value) || 0;
        totalHoursColumn += hours;
      });

      // Zaktualizuj sumę godzin dla danego dnia
      const totalCell = totalTable.querySelector(
        `tr:last-child td:nth-child(${i + 1})`
      );
      totalCell.textContent = totalHoursColumn.toFixed(1);
    }
  }

  function createTotalTableIfNotExists(caretakerName) {
    if (!caretakerData[caretakerName].totalTable) {
      const totalTable = createTotalTable();
      caretakerData[caretakerName].totalTable = totalTable;
      tableContainer.appendChild(totalTable);
    }
    return caretakerData[caretakerName].totalTable;
  }

  function createTotalTable() {
    const totalTable = document.createElement('table');
    totalTable.classList.add('totalTable');

    const headerRow = totalTable.insertRow(0);
    headerRow.insertCell(0).textContent = 'Podopieczny';

    for (let i = 1; i <= 5; i++) {
      const dayOfWeek = getDayOfWeek(i);
      const headerCell = headerRow.insertCell(i);
      headerCell.textContent = dayOfWeek;
      headerCell.classList.add('total'); // Dodaj klasę dla sumy godzin pod każdym dniem
    }

    // Dodaj pusty wiersz do przechowywania sumy godzin
    const totalRow = totalTable.insertRow(1);
    totalRow.insertCell(0).textContent = 'Suma';
    totalRow.classList.add('total');

    for (let i = 1; i <= 5; i++) {
      const totalCell = totalRow.insertCell(i);
      totalCell.classList.add('total');
    }

    return totalTable;
  }
});
