class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(callback) {
    this._observers.push(callback);
  }

  removeObserver(observer) {
    this._observers.filter((existedObserver) => existedObserver !== observer);
  }

  _notyfy(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}

export default Observer;
