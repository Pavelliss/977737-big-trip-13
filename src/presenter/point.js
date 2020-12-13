import {render, replace, remove} from "../utils/render";
import {isEscapeEvent} from "../utils/dom-events";

import TripEventView from "../view/trip-event";
import FormEditView from "../view/form-edit";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITTING: `EDITTING`,
};

class Point {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._tripPointComponent = null;
    this._formEditComponent = null;
    this._tripPoint = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onButtonOpenFormClick = this._onButtonOpenFormClick.bind(this);
    this._onButtonCloseFormClick = this._onButtonCloseFormClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormReset = this._onFormReset.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  init(tripPoint) {
    this._tripPoint = tripPoint;

    const prevTripPointComponent = this._tripPointComponent;
    const prevFormEditComponent = this._formEditComponent;

    this._tripPointComponent = new TripEventView(this._tripPoint);
    this._formEditComponent = new FormEditView(this._tripPoint);

    this._tripPointComponent.setButtonClickHandler(this._onButtonOpenFormClick);
    this._tripPointComponent.setButtonFavoriteHandler(this._onFavoriteClick);

    this._formEditComponent.setFormButtonClickHandler(this._onButtonCloseFormClick);
    this._formEditComponent.setFormSubmitHandler(this._onFormSubmit);
    this._formEditComponent.setFormResetHandler(this._onFormReset);

    if (prevTripPointComponent === null
       || prevFormEditComponent === null) {
      render(this._container, this._tripPointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripPointComponent, prevTripPointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._formEditComponent, prevFormEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevFormEditComponent);
  }

  destroy() {
    remove(this._tripPointComponent);
    remove(this._formEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormEditToTripPoint();
    }
  }

  _replaceTripPointToFormEdit() {
    replace(this._formEditComponent, this._tripPointComponent);
    this._changeMode();
    this._mode = Mode.EDITTING;
  }

  _replaceFormEditToTripPoint() {
    replace(this._tripPointComponent, this._formEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _hideFormEdit() {
    this._replaceFormEditToTripPoint();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this._formEditComponent.reset(this._tripPoint);
      this._hideFormEdit();
    }
  }

  _onButtonOpenFormClick() {
    this._replaceTripPointToFormEdit();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onButtonCloseFormClick() {
    this._formEditComponent.reset(this._tripPoint);
    this._hideFormEdit();
  }

  _onFormSubmit(point) {
    this._hideFormEdit();
    this._changeData(point);
  }

  _onFormReset() {
    this._formEditComponent.reset(this._tripPoint);
    this._hideFormEdit();
  }

  _onFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._tripPoint,
            {
              isFavorite: !this._tripPoint.isFavorite
            }
        )
    );
  }
}

export default Point;
