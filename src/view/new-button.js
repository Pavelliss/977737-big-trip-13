import AbstractView from "./adstract";

const newEventButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

class NewButton extends AbstractView {
  getTemplate() {
    return newEventButtonTemplate();
  }

  disabled() {
    this.getElement().setAttribute(`disabled`, `disabled`);
  }

  enabled() {
    this.getElement().removeAttribute(`disabled`);
  }
}

export default NewButton;
