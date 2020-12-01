import AbstractView from "./adstract";

const newEventButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

class NewButton extends AbstractView {
  getTemplate() {
    return newEventButtonTemplate();
  }
}

export default NewButton;
