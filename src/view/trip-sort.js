import {sortElementTemplate} from "./sort-element";

const tripSortTemplate = () => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortElementTemplate(`day`, true)}
    ${sortElementTemplate(`event`)}
    ${sortElementTemplate(`time`)}
    ${sortElementTemplate(`price`)}
    ${sortElementTemplate(`offer`)}
  </form>`;
};

export {tripSortTemplate};
