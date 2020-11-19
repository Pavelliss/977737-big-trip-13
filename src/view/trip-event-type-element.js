import {makeСapitalizedLetter} from "../utils/util";

const tripEventTypeElementTemplate = (type, isChecked = false) => {
  return `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${makeСapitalizedLetter(type)}</label>
  </div>`;
};

export {tripEventTypeElementTemplate};
