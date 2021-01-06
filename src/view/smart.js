import AbstractView from "./adstract";

class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData(updata, justUpdate) {
    if (!updata) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        updata
    );

    if (justUpdate) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}

export default Smart;
