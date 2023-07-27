import Choices from 'choices.js';

export default (selects) => {
  selects.forEach((select) => {
    if (select.classList.contains('no-init')) {
      new Choices(select, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
        position: 'bottom',
        duplicateItemsAllowed: false,
        allowHTML: true,
      });

      select.classList.remove('no-init');
    }
  });
};
