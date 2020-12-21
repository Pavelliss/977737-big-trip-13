import AbstractView from "./adstract";

const filterTitleTemplate = () => `<h2 class="visually-hidden">Filter events</h2>;`;

class FilterTitle extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return filterTitleTemplate();
  }
}

export default FilterTitle;
