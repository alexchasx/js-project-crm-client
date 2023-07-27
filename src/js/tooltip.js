import { computePosition, flip, shift, offset, arrow } from '@floating-ui/dom';

const tooltip = () => {
  document.querySelectorAll('.contacts-icons__btn').forEach((button) => {
    const tooltip = button.nextElementSibling;
    const arrowElement = tooltip.querySelector('.contacts-icons__arrow');

    const update = () => {
      computePosition(button, tooltip, {
        placement: 'top',
        middleware: [
          offset(7),
          flip(),
          shift({ padding: 5 }),
          arrow({ element: arrowElement }),
        ],
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]];

        Object.assign(arrowElement.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-4px',
        });
      });
    };

    const showTooltip = () => {
      tooltip.style.display = 'block';
      update();
    };

    const hideTooltip = () => {
      tooltip.style.display = '';
    };

    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
      ['focus', showTooltip],
      ['blur', hideTooltip],
    ].forEach(([event, listener]) => {
      button.addEventListener(event, listener);
    });
  });
};

export default tooltip;
