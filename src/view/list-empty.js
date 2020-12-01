import AbstractVire from "./adstract";

const listEmptyTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

class ListEmpty extends AbstractVire {
  getTemplate() {
    return listEmptyTemplate();
  }
}

export default ListEmpty;
