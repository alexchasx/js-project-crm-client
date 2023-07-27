import { get, getAll, closeModalEvent, click, show } from './functions';
import {
  createContactField,
  checkExistContactField,
  addContactEvent,
  submitEvent,
  formFieldEvents,
} from './modal-create';
import customSelect from './custom-select';
import { getClient, updateClient } from './requests';
import { deleteClientEvent } from './modal-delete';

const fillUpdateModal = async (modal, id) => {
  const client = await getClient(id);

  if (client) {
    const renderId = get('.render-id', modal);
    renderId.innerHTML = '';
    renderId.append('ID: ' + id);
    modal.setAttribute('data-id', id);

    get('[name=surname]', modal).setAttribute('value', client.surname);
    get('[name=name]', modal).setAttribute('value', client.name);
    get('[name=lastname]', modal).setAttribute('value', client.lastName);

    formFieldEvents(modal);

    const contactsWrap = get('.form__contacts-wrap', modal);
    contactsWrap.innerHTML = '';
    client.contacts.forEach((contact) => {
      const contactField = createContactField(modal, contact);
      contactsWrap.append(contactField);
    });

    checkExistContactField(modal);

    const selects = getAll('.contacts-field__select');
    customSelect(selects);
  }

  show(modal);
};

const showUpdateModal = async (modal) => {
  const btn = getAll('.action-update');
  click(btn, async (event) => {
    get('.modal__error-message', modal).innerHTML = '';
    event.target.classList.add('action-update--preloader');

    const id = event.target.closest('.tbody-tr').getAttribute('data-id');
    window.location.hash = id;
    await fillUpdateModal(modal, id);
    event.target.classList.remove('action-update--preloader');

    addContactEvent(modal);
    submitEvent(modal, updateClient);
    deleteClientEvent(modal, get('.form__delete-btn', modal));
  });
};

const showClient = async (modal) => {
  const hash = window.location.hash;
  if (hash) {
    const id = hash.replace('#', '');
    await fillUpdateModal(modal, id);

    addContactEvent(modal);
    submitEvent(modal, updateClient);
    deleteClientEvent(modal, get('.form__delete-btn', modal));
  }
};

export default () => {
  const modal = get('#modal-update');

  closeModalEvent(modal);
  showUpdateModal(modal);
  showClient(modal);

  window.onhashchange = () => {
    showClient(modal);
  };
};
