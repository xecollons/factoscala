import { ClockInOptions, ClockInOptionsInterval } from './models';

document.addEventListener('DOMContentLoaded', () => {
  const intervalsContainer = document.getElementById(
    'intervalsContainer'
  ) as HTMLElement;
  const addIntervalBtn = document.getElementById(
    'addIntervalBtn'
  ) as HTMLButtonElement;
  const clockInBtn = document.getElementById('clockInBtn') as HTMLButtonElement;

  const createTimeInput = (name: string, value: string): HTMLInputElement => {
    const input = document.createElement('input');
    input.type = 'time';
    input.name = name;
    input.required = true;
    input.value = value;
    return input;
  };

  function createNewIntervalInput(
    clockIn: string = '09:00',
    clockOut: string = '14:00'
  ): void {
    const intervalDiv = document.createElement('div');
    intervalDiv.classList.add('interval');

    intervalDiv.append(
      createTimeInput('clock-in', clockIn),
      createTimeInput('clock-out', clockOut)
    );

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';

    const trashIcon = document.createElement('img');
    trashIcon.src = 'assets/svg/trash.svg';
    trashIcon.alt = 'Remove';
    trashIcon.style.width = '14px';
    trashIcon.style.height = '18px';

    removeBtn.appendChild(trashIcon);
    removeBtn.addEventListener('click', () => intervalDiv.remove());

    intervalDiv.appendChild(removeBtn);
    intervalsContainer.appendChild(intervalDiv);
  }

  addIntervalBtn.addEventListener('click', () => createNewIntervalInput());

  clockInBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let month: number;
      let year: number;

      if (tabs.length > 0 && tabs[0].url) {
        const url = tabs[0].url;
        console.log('URL:', url);
        const match = url.match(/\/monthly\/(\d{4})\/(\d{1,2})\//);

        if (match) {
          year = parseInt(match[1]);
          month = parseInt(match[2]) - 1; // Parece que los meses van de 0 a 11, cosas extrañas de JavaScript
          console.log('Year:', year, 'Month:', month);
        }
      } else {
        console.error('No se pudo obtener la URL de la pestaña activa');
        var now = new Date();
        month = now.getMonth();
        year = now.getFullYear();
      }

      const intervalDivs = intervalsContainer.querySelectorAll('.interval');
      const intervals: ClockInOptionsInterval[] = Array.from(intervalDivs).map(
        (div: Element) => ({
          clock_in: (
            div.querySelector('input[name="clock-in"]') as HTMLInputElement
          ).value,
          clock_out: (
            div.querySelector('input[name="clock-out"]') as HTMLInputElement
          ).value,
        })
      );

      const clockInOptions: ClockInOptions = { month, year, intervals };

      console.log('Data to send:', clockInOptions);

      chrome.runtime.sendMessage(
        { command: 'clockInPressed', params: clockInOptions },
        (response) => {
          console.log('Respuesta recibida:', response);
          chrome.tabs.reload(tabs[0].id);
        }
      );
    });
  });

  // Agregamos intervalos iniciales con valores predeterminados
  createNewIntervalInput('09:00', '14:00');
  createNewIntervalInput('15:00', '18:00');
});
