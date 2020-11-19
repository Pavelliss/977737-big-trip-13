import {offerElementTemplate} from "./offer-element";

const tripEventOffersTemplate = () => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offerElementTemplate(`Add luggage`, `30`, true)}
      ${offerElementTemplate(`Switch to comfort class`, `100`, true)}
      ${offerElementTemplate(`Add meal`, `15`)}
      ${offerElementTemplate(`Choose seats`, `5`)}
      ${offerElementTemplate(`Travel by train`, `40`)}
    </div>
  </section>`;
};

export {tripEventOffersTemplate};
