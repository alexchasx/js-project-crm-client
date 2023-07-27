import { get, getAll } from './functions';
import { tableRender } from './table-render';

const sort = (arr, prop, sortAsc = false) =>
  arr.sort((a, b) =>
    (!sortAsc ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 0
  );

const directionActivate = (btn) => {
  getAll('.img-arrow').forEach((element) => {
    element.classList.remove('sort-active');
  });

  const arrow = get('.img-arrow', btn);
  arrow.classList.add('sort-active');

  const direction = 'sort-asc';
  let sortAsc = false;
  if (arrow.classList.contains(direction)) {
    arrow.classList.remove(direction);
    sortAsc = true;
  } else {
    arrow.classList.add(direction);
  }

  return sortAsc;
};

const sortEvent = (field, btnClassName, clients) => {
  const btn = get(btnClassName);

  btn.onclick = () => {
    const sortAsc = directionActivate(btn);

    if (field === 'fio') {
      sort(clients, 'lastName', sortAsc);
      sort(clients, 'name', sortAsc);
      sort(clients, 'surname', sortAsc);
    } else {
      sort(clients, field, sortAsc);
    }

    tableRender(clients);
  };
};

export default (clients) => {
  sortEvent('id', '.table__th-id', clients);
  sortEvent('fio', '.table__th-name', clients);
  sortEvent('createdAt', '.table__th-date.created-at', clients);
  sortEvent('updatedAt', '.table__th-date.updated-at', clients);
};
