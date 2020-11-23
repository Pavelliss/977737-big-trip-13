import {getRandomInteger} from "../mock/util";

const MAX_OFFERS_COUNT = 5;

const createOfferTemplate = (id, offers) => {
  const sortOffers = offers.sort((a, b) => b.isChecked - a.isChecked);
  const offersCount = getRandomInteger(0, MAX_OFFERS_COUNT);


  return sortOffers.slice(0, offersCount).map((offer) => {
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-${id}" type="checkbox" name="event-offer-${offer.name}" ${offer.isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${offer.name}-${id}">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  }).join(``);
};

const tripEventOffersTemplate = (id, offers) => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createOfferTemplate(id, offers)}
    </div>
  </section>`;
};

export {tripEventOffersTemplate};
