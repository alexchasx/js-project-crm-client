export const create = (tag, classNames, textContent = '') => {
  const element = document.createElement(tag);
  element.className = classNames;
  element.textContent = textContent;

  return element;
};

export const get = (selector, closest = document) =>
  closest.querySelector(selector);

export const getAll = (selector, closest = document) =>
  closest.querySelectorAll(selector);

export const event = (event, element, callback) => {
  if (typeof element[Symbol.iterator] === 'function') {
    element.forEach((element) => {
      element.addEventListener(event, callback);
    });
    return null;
  }

  element.addEventListener(event, callback);
};

export const click = (element, callback) => {
  event('click', element, callback);
};

export const clickOnce = (element, callback) => {
  element.addEventListener('click', callback, { once: true });
};

export const show = (modal) => {
  modal.classList.add('modal-active');
  get('#shadow').classList.add('modal-active');
};

export const hidden = (modal) => {
  window.location.hash = '';
  modal.classList.remove('modal-active');
  get('#shadow').classList.remove('modal-active');
};

export const closeModalEvent = (modal) => {
  click(
    [get('#shadow'), get('.cancel-btn', modal), get('.form__cancel', modal)],
    () => {
      hidden(modal);
    }
  );
};

export const showPreloader = () => {
  const tbody = get('#client-list');
  tbody.classList.add('table__body--loading');

  const preloader = create('div', 'preloader screen-center');
  get('body').append(preloader);
  preloader.classList.add('preloader--img');
};

export const hiddenPreloader = () => {
  const tbody = get('#client-list');
  tbody.classList.remove('table__body--loading');

  getAll('.preloader').forEach((preloader) => {
    if (preloader) {
      preloader.remove();
    }
  });
};

// Принудительная задержка скрипта
export const sleep = async (delay) => {
  if (delay) {
    await new Promise((r) => setTimeout(r, delay));
  }
};
