import '../css/main.css';
import '../css/media.css';
import { getClients } from './requests';
import { tableRender } from './table-render';
import { saveClientEvent } from './modal-create';
import clientSort from './client-sort';
import search from './search';
import { showPreloader } from './functions';

showPreloader();

const createList = async () => {
  saveClientEvent();

  const clients = await getClients();
  if (clients) {
    tableRender(clients);
    clientSort(clients);
  }

  search();
};

document.addEventListener('DOMContentLoaded', () => createList());
