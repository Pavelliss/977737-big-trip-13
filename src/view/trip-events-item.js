import AbstractView from "./adstract";

const tripEventsItemTemplate = () => `<li class="trip-events__item"></li>`;

class TripEventsItem extends AbstractView {
  getTemplate() {
    return tripEventsItemTemplate();
  }
}

export default TripEventsItem;
