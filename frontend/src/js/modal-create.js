import {
  create,
  get,
  getAll,
  click,
  event,
  show,
  hidden,
  closeModalEvent,
} from './functions';
import customSelect from './custom-select';
import { tableRender } from './table-render';
import { storeClient, getClients } from './requests';

const MAX_CONTACTS_COUNT = 10;
const CONTACTS_TYPES = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое'];

const createSelect = (selectedType = '') => {
  const select = create('select', 'contacts-field__select no-init');
  select.setAttribute('name', 'contact_type');
  CONTACTS_TYPES.forEach((value) => {
    const option = create('option', 'contacts-field__option', value);
    if (selectedType && selectedType === value) {
      option.setAttribute('selected', 'selected');
    }
    select.append(option);
  });

  return select;
};

const createInput = () => {
  const input = create('input', 'contacts-field__input');
  input.setAttribute('name', 'contact_value');
  input.setAttribute('placeholder', 'Введите данные контакта');

  return input;
};

export const createContactField = (modal, contact = null) => {
  const contactField = create('div', 'contacts-field');
  const cancelContactBtn = create('button', 'contacts-field__cancel');
  const input = createInput();

  let selectedType = '';
  if (contact) {
    input.setAttribute('value', contact.value);
    selectedType = contact.type;
  }
  const select = createSelect(selectedType);

  // добавляет кнопку удаления контакта
  event('blur', input, () => {
    contactField.append(cancelContactBtn);
  });

  event('input', input, () => {
    const errorMessage = get('p.error-contacts', modal);
    if (errorMessage) {
      errorMessage.remove();
    }
  });

  // удаляет поле контакта
  cancelContactBtn.onclick = () => {
    contactField.remove();
    checkExistContactField(modal);
  };

  contactField.append(select);
  contactField.append(input);
  if (selectedType) {
    contactField.append(cancelContactBtn);
  }

  return contactField;
};

export const checkExistContactField = (modal) => {
  const contactField = get('.contacts-field', modal);
  if (contactField) {
    get('.form__add-contact', modal).classList.add('exist-field');
    get('.form__contacts-wrap', modal).classList.remove('display-none');
  } else {
    get('.form__add-contact', modal).classList.remove('exist-field');
    get('.form__contacts-wrap', modal).classList.add('display-none');
  }
};

export const formFieldEvents = (modal) => {
  getAll('.form__field', modal).forEach((formField) => {
    formField.classList.remove('opacity-1');

    formField.onblur = () => {
      if (formField.value) {
        formField.classList.add('opacity-1');
      } else {
        formField.classList.remove('opacity-1');
      }
    };

    event('input', formField, () => {
      const errorMessage = get(
        'p.error-' + formField.getAttribute('name'),
        modal
      );
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  });
};

export const addContactEvent = (modal) => {
  const addContactBtn = get('.form__add-contact', modal);
  addContactBtn.classList.remove('display-none');

  addContactBtn.onclick = () => {
    get('.form__contacts-wrap', modal).classList.remove('display-none');

    const contactField = createContactField(modal);
    get('.form__contacts-wrap', modal).append(contactField);

    checkExistContactField(modal);

    const selects = getAll('.contacts-field__select', modal);
    if (selects.length >= MAX_CONTACTS_COUNT) {
      addContactBtn.classList.add('display-none');
    }

    customSelect(selects);
  };
};

export const getClientFromForm = (modal) => {
  const client = {
    name: get('[name=name]', modal).value.trim(),
    surname: get('[name=surname]', modal).value.trim(),
    lastName: get('[name=lastname]', modal).value.trim(),
    contacts: [],
  };

  getAll('.contacts-field__select', modal).forEach((select) => {
    client.contacts.push({
      type: get('option', select).value,
      value: get('input', select.closest('.contacts-field')).value,
    });
  });

  return client;
};

const toggleInputs = (submitBtn, modal, load = true) => {
  if (load) {
    submitBtn.classList.add('submit--preloader');
    getAll('input', modal).forEach((input) => {
      input.setAttribute('disabled', 'disabled');
      input.classList.add('opacity-0');
    });
    getAll('button', modal).forEach((button) => {
      button.setAttribute('disabled', 'disabled');
    });
  } else {
    submitBtn.classList.remove('submit--preloader');
    getAll('input', modal).forEach((input) => {
      input.removeAttribute('disabled', 'disabled');
      input.classList.remove('opacity-0');
    });
    getAll('button', modal).forEach((button) => {
      button.removeAttribute('disabled', 'disabled');
    });
  }
};

export const submitEvent = (modal, callback) => {
  get('[type=submit]', modal).onclick = async (e) => {
    e.preventDefault();

    const submitBtn = e.target;
    toggleInputs(submitBtn, modal);

    const clientData = getClientFromForm(modal);
    clientData.id = modal.getAttribute('data-id');

    if (await callback(modal, clientData)) {
      const clients = await getClients();
      if (clients) {
        hidden(modal);
        tableRender(clients);
        modal.querySelector('form').reset();
      }
    }

    toggleInputs(submitBtn, modal, false);
  };
};

const showModalEvent = (modal) => {
  const showModalBtn = get('.table__btn-add');
  click(showModalBtn, () => {
    get('.modal__error-message', modal).innerHTML = '';
    formFieldEvents(modal);

    get('[name=surname]', modal).setAttribute('value', '');
    get('[name=name]', modal).setAttribute('value', '');
    get('[name=lastname]', modal).setAttribute('value', '');
    get('form').reset();

    addContactEvent(modal);
    submitEvent(modal, storeClient);

    getAll('.contacts-field', modal).forEach((element) => {
      element?.remove();
    });

    checkExistContactField(modal);
    show(modal);
  });
};

export const saveClientEvent = () => {
  const modal = get('#modal-create');

  closeModalEvent(modal);
  showModalEvent(modal);
};
