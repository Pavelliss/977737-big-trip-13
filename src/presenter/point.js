import {render, replace, remove} from "../utils/render";
import {isEscapeEvent} from "../utils/dom-events";
import {UserAction, UpdateType} from "../const";

import TripEventView from "../view/trip-event";
import FormEditView from "../view/form-edit";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITTING: `EDITTING`,
};

const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

class Point {
  constructor(
      container,
      changeData,
      changeMode,
      serverData,
      formattedData
  ) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._serverData = serverData;
    this._formattedData = formattedData;
    this._mode = Mode.DEFAULT;

    this._tripPointComponent = null;
    this._formEditComponent = null;
    this._tripPoint = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onButtonOpenFormClick = this._onButtonOpenFormClick.bind(this);
    this._onButtonCloseFormClick = this._onButtonCloseFormClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFormDeleteClick = this._onFormDeleteClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  init(tripPoint) {
    this._tripPoint = tripPoint;

    const prevTripPointComponent = this._tripPointComponent;
    const prevFormEditComponent = this._formEditComponent;

    this._tripPointComponent = new TripEventView(this._tripPoint);
    this._formEditComponent = new FormEditView(this._serverData, this._formattedData, this._tripPoint);

    this._tripPointComponent.setButtonClickHandler(this._onButtonOpenFormClick);
    this._tripPointComponent.setButtonFavoriteHandler(this._onFavoriteClick);

    this._formEditComponent.setFormButtonClickHandler(this._onButtonCloseFormClick);
    this._formEditComponent.setFormSubmitHandler(this._onFormSubmit);
    this._formEditComponent.setFormDeleteHandler(this._onFormDeleteClick);

    if (prevTripPointComponent === null
       || prevFormEditComponent === null) {
      render(this._container, this._tripPointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripPointComponent, prevTripPointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._tripPointComponent, prevFormEditComponent);
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

  setViewState(state) {
    const resetFormState = () => {
      this._formEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._formEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._formEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._tripPointComponent.shake(resetFormState);
        this._formEditComponent.shake(resetFormState);
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
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
  }

  _onFormDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _onFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
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
export {State};
export default Point;
