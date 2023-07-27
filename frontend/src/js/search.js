import {
  get,
  event,
  showPreloader,
  create,
  hiddenPreloader,
  click,
  getAll,
} from './functions';
import { getClients } from './requests';

const INPUT_DELAY = 300;

const keyEnterEvent = (searchWrap) => {
  event('keydown', searchWrap, (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      document.activeElement.click();
    }
  });
};

const keyArrowDownEvent = (searchWrap) => {
  const firstChild = get('.auto-completion', searchWrap).firstChild;
  let active = firstChild;
  if (active) {
    event('keydown', searchWrap, (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        active.focus();

        active = active.nextElementSibling;
        if (!active) {
          active = firstChild;
        }
      }
    });
  }
};

const keyArrowUpEvent = (searchWrap) => {
  const lastChild = get('.auto-completion', searchWrap).lastChild;
  let active = lastChild;
  if (active) {
    event('keyup', searchWrap, (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        active.focus();

        active = active.previousElementSibling;
        if (!active) {
          active = lastChild;
        }
      }
    });
  }
};

const keyEvents = () => {
  const searchWrap = get('.header__search');
  keyArrowDownEvent(searchWrap);
  keyArrowUpEvent(searchWrap);
  keyEnterEvent(searchWrap);
};

const scrollTo = (li, id) => {
  click(li, () => {
    const clientRow = get('.tbody-tr[data-id="' + id + '"]');
    clientRow.classList.add('active-client-row');
    clientRow.scrollIntoView(false);
  });
};

const autoСompletion = (clients, list) => {
  list.innerHTML = '';
  if (list.classList.contains('display-none') === false) {
    list.classList.add('display-none');
  }

  if (clients && clients.length) {
    list.classList.remove('display-none');

    let tabindex = 0;
    for (const client of clients) {
      const id = client.id;
      const li = create('li', 'auto-completion__item');
      li.setAttribute('data-link', id);
      li.setAttribute('tabindex', tabindex);
      li.textContent = client.name + ' ' + client.surname;

      list.append(li);

      scrollTo(li, id);
    }
  }
};

const searchClear = () => {
  click(get('.main'), () => {
    const list = get('.auto-completion');
    list.classList.add('display-none');
    list.innerHTML = '';

    getAll('.tbody-tr').forEach((clientRow) => {
      clientRow.classList.remove('active-client-row');
    });

    get('.search__input').value = '';
  });
};

const search = () => {
  const input = get('#search');
  const list = get('.auto-completion');

  let timer = null;
  input.onkeypress = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      timer = null;
      showPreloader();

      const searchString = '?search=' + input.value;
      const clients = await getClients(searchString);

      autoСompletion(clients, list);
      hiddenPreloader();
      keyEvents();
    }, INPUT_DELAY);
  };

  searchClear();
};

export default () => {
  search();
};
