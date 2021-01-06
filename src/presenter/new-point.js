import {nanoid} from "nanoid";
import {UserAction, UpdateType} from "../const";
import {remove, render, RenderPosition} from "../utils/render";
import {isEscapeEvent} from "../utils/dom-events";

import FormEditView from "../view/form-edit";
import TripEventsItemView from "../view/trip-events-item";

class NewPoint {
  constructor(
      container,
      changeData,
      newButtonComponent,
      serverData,
      formattedData
  ) {

    this._container = container;
    this._changeData = changeData;
    this._serverData = serverData;
    this._formattedData = formattedData;

    this._newButtonComponent = newButtonComponent;
    this._tripEventsItemComponent = null;
    this._formEditComponent = null;

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormCancelClick = this._onFormCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init() {
    if (this._formEditComponent !== null) {
      return;
    }

    this._tripEventsItemComponent = new TripEventsItemView();
    this._formEditComponent = new FormEditView(this._serverData, this._formattedData);
    this._formEditComponent.setFormSubmitHandler(this._onFormSubmit);
    this._formEditComponent.setFormDeleteHandler(this._onFormCancelClick);

    render(
        this._container,
        this._tripEventsItemComponent,
        RenderPosition.AFTERBEGIN
    );

    render(
        this._tripEventsItemComponent,
        this._formEditComponent
    );

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  destroy() {
    if (this._formEditComponent === null) {
      return;
    }

    remove(this._formEditComponent);
    remove(this._tripEventsItemComponent);

    this._tripEventsItemComponent = null;
    this._formEditComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onFormSubmit(point) {
    this._newButtonComponent.getElement().removeAttribute(`disabled`);
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, point)
    );
  }

  _onFormCancelClick() {
    this.destroy();
    this._newButtonComponent.getElement().removeAttribute(`disabled`);
  }

  _onEscKeyDown(evt) {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.destroy();
      this._newButtonComponent.getElement().removeAttribute(`disabled`);
    }
  }
}

export default NewPoint;
