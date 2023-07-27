import { get, sleep, hiddenPreloader } from './functions';

const QUERY_STRING = 'http://localhost:3000/api/clients/';
const MESSAGE_404 = '<p>Ничего&nbsp;не&nbsp;найдено</p>';
const TEST_LOADING_DELAY = 0;

const jsonHeader = { 'Content-Type': 'application/json' };

const sendErrorMessage = (errorMessages, modal = null) => {
  if (modal) {
    get('.modal__error-message', modal).innerHTML = errorMessages;
  }

  hiddenPreloader();
};

const handleErrorMessage = async (response, modal = null) => {
  let errorMessages = '';
  if ([404, 422].includes(response.status) || response.status >= 500) {
    await response.json().then((json) => {
      json.errors.forEach((error) => {
        errorMessages += `<p>${error.message}</p>`;
      });
    });
  } else {
    errorMessages = 'Что-то пошло не так...';
  }

  sendErrorMessage(errorMessages, modal);
};

const validation = (modal, clientData) => {
  let errorMessages = '';
  for (const [key, val] of Object.entries(clientData)) {
    if (key === 'name' && !val) {
      errorMessages += `<p class="error-name">Имя обязательно для заполнения</p>`;
    }
    if (key === 'surname' && !val) {
      errorMessages += `<p class="error-surname">Фамилия обязательна для заполнения</p>`;
    }
    if (key === 'contacts' && val.length) {
      for (const contact of val) {
        if (!contact.value) {
          errorMessages += `<p class="error-contacts">Каждый добавленный контакт должен быть заполнен</p>`;
          break;
        }
      }
    }
  }

  if (errorMessages) {
    sendErrorMessage(errorMessages, modal);

    return false;
  }

  return true;
};

export const getClients = async (searchSring = '') => {
  // Принудительная задержка скрипта (для тестирования)
  await sleep(TEST_LOADING_DELAY);

  const response = await fetch(QUERY_STRING + searchSring);
  if (response.ok) {
    const clients = await response.json();
    if (clients.length === 0) {
      sendErrorMessage(MESSAGE_404);
    }

    return clients;
  }
};

export const storeClient = async (modal, clientData) => {
  if (!validation(modal, clientData)) {
    return false;
  }

  // Принудительная задержка скрипта (для тестирования)
  await sleep(TEST_LOADING_DELAY);

  const response = await fetch(QUERY_STRING, {
    method: 'POST',
    body: JSON.stringify(clientData),
    headers: jsonHeader,
  });

  if (response.ok) {
    return true;
  }
  handleErrorMessage(response, modal);

  return false;
};

export const getClient = async (id) => {
  // Принудительная задержка скрипта (для тестирования)
  await sleep(TEST_LOADING_DELAY);

  const response = await fetch(QUERY_STRING + id);
  if (response.ok) {
    const client = await response.json();
    if (client.length === 0) {
      sendErrorMessage(MESSAGE_404);
    }

    return client;
  }

  handleErrorMessage(response);
};

export const deleteClient = async (id) => {
  // Принудительная задержка скрипта (для тестирования)
  await sleep(TEST_LOADING_DELAY);

  const response = await fetch(QUERY_STRING + id, {
    method: 'DELETE',
    headers: jsonHeader,
  });

  if (response.ok) {
    return true;
  }
  handleErrorMessage(response);
};

export const updateClient = async (modal, clientData) => {
  if (!validation(modal, clientData)) {
    return false;
  }

  // Принудительная задержка скрипта (для тестирования)
  await sleep(TEST_LOADING_DELAY);

  const response = await fetch(QUERY_STRING + clientData.id, {
    method: 'PATCH',
    body: JSON.stringify(clientData),
    headers: jsonHeader,
  });

  if (response.ok) {
    return true;
  }
  handleErrorMessage(response, modal);
};
