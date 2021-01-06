import AbstractView from "./adstract";

const getLoadingTemplate = () => `<p class="trip-events__msg">Loading...</p>`;

class Loading extends AbstractView {
  getTemplate() {
    return getLoadingTemplate();
  }
}

export default Loading;
