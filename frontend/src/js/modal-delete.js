import { get, getAll, closeModalEvent, show, hidden, click } from './functions';
import { deleteClient, getClients } from './requests';
import clientSort from './client-sort';

const sortingDataUpdate = async () => {
  const clients = await getClients();
  if (clients) {
    clientSort(clients);
  }
};

export const deleteClientEvent = (modal, btn) => {
  btn.onclick = async () => {
    const id = modal.getAttribute('data-id');
    if (id) {
      const result = await deleteClient(id);
      if (result) {
        const tableRow = get('.tbody-tr[data-id="' + id + '"]');
        tableRow.remove();

        await sortingDataUpdate();
        hidden(modal);
      }
    }
  };
};

export const showModalEvent = (modal) => {
  getAll('.action-delete').forEach((btn) => {
    click(btn, () => {
      const id = btn.closest('.tbody-tr').getAttribute('data-id');
      modal.setAttribute('data-id', id);

      show(modal);
    });
  });
};

export const showDeleteModal = () => {
  const modal = get('#modal-delete');
  showModalEvent(modal);
  closeModalEvent(modal);
  deleteClientEvent(modal, get('.client-delete', modal));
};
