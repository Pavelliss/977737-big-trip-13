import AbstractView from "./adstract";

const tripEventListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

class TripEventList extends AbstractView {
  getTemplate() {
    return tripEventListTemplate();
  }
}

export default TripEventList;
