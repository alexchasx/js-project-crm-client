import tooltip from './tooltip';
import { create, get, hiddenPreloader } from './functions';
import { showDeleteModal } from './modal-delete';
import updateClientEvent from './modal-update';

const createDateTd = (classNames, dateString) => {
  const td = create(
    'td',
    classNames,
    new Date(dateString).toLocaleDateString('ru-RU')
  );
  const span = create(
    'span',
    'table__time',
    new Date(dateString).toLocaleTimeString('ru-RU').slice(0, 5)
  );
  td.append(span);

  return td;
};

const getIconClass = (type) => {
  const iconClasses = {
    Телефон: 'phone',
    Email: 'mail',
    Facebook: 'facebook',
    VK: 'vk',
  };

  return iconClasses[type] || 'other';
};

const createContactsTd = (contacts) => {
  const td = create('td', 'table__td contacts-icons');
  const wrap = create('div', 'table__icon-wrap');

  contacts.forEach((contact) => {
    const icon = create(
      'button',
      'contacts-icons__btn contacts-icons--' + getIconClass(contact.type)
    );
    const tooltip = create(
      'div',
      'contacts-icons__tooltip',
      `**${contact.type}**: ${contact.value}`
    );

    tooltip.append(create('div', 'contacts-icons__arrow'));
    wrap.append(icon, tooltip);
  });

  td.append(wrap);

  return td;
};

const createActionTd = () => {
  const td = create('td', 'table__td table__td--action');
  const deleteBtn = create('button', 'btn-reset action-delete', 'Удалить');
  const updateBtn = create('button', 'btn-reset action-update', 'Изменить');
  td.append(updateBtn, deleteBtn);

  return td;
};

export const tableRender = (clients) => {
  const tbody = get('#client-list');
  tbody.innerHTML = '';

  if (clients && clients.length) {
    for (const client of clients) {
      const tr = create('tr', 'table__tr tbody-tr');
      tr.setAttribute('data-id', client.id);

      tr.append(
        create('td', 'table__td table__td-id', client.id),
        create(
          'td',
          'table__td table__td-name',
          client.surname + ' ' + client.name + ' ' + client.lastName
        ),
        createDateTd('table__td table__td-created', client.createdAt),
        createDateTd('table__td table__td-updated', client.updatedAt),
        createContactsTd(client.contacts),
        createActionTd()
      );

      hiddenPreloader();
      tbody.append(tr);
    }

    tooltip();
    showDeleteModal();
    updateClientEvent();
  } else {
    tbody.innerHTML = '<p>Ничего&nbsp;не&nbsp;найдено</p>';
  }
};
