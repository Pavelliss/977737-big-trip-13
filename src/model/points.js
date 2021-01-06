import Observer from "../utils/observer";

class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, tripPoints) {
    this._points = tripPoints;
    this._notyfy(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notyfy(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notyfy(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notyfy(updateType, update);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          routeType: point.type,
          time: {
            start: point.date_from !== null ? new Date(point.date_from) : point.date_from,
            end: point.date_to !== null ? new Date(point.date_to) : point.date_to
          },
          destination: {
            photos: point.destination.pictures,
            description: point.destination.description
          },
          city: point.destination.name,
          price: point.base_price,
          isFavorite: point.is_favorite,
        }
    );

    delete adaptedPoint.type;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.destination.pictures;
    delete adaptedPoint.destination.name;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    console.log(point)
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "type": point.routeType,
          "date_from": point.time.start instanceof Date ? point.time.start.toISOString() : null,
          "date_to": point.time.end instanceof Date ? point.time.end.toISOString() : null,
          "destination": {
            "name": point.city,
            "description": point.destination.description,
            "pictures": point.destination.photos,
          },
          "base_price": point.price,
          "is_favorite": point.isFavorite,
        }
    );

    delete adaptedPoint.routeType;
    delete adaptedPoint.time;
    delete adaptedPoint.destination.photos;
    delete adaptedPoint.city;
    delete adaptedPoint.price;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}

export default Points;
