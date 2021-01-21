const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic Speaking_in_Tongues [SPiT]`;
const HOURS_IN_DAY = 24;

const ROUTE_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const TimeMS = {
  day: 86400000,
  hour: 3600000,
  minute: 60000,
};

const SortType = {
  DAY: `DAY`,
  TIME: `TIME`,
  PRICE: `PRICE`,
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`,
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const MenuItem = {
  TABLE: `TABLE`,
  STATISTICS: `STATISTICS`,
};


export {
  END_POINT,
  AUTHORIZATION,
  HOURS_IN_DAY,
  ROUTE_TYPES,
  TimeMS,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem,
};
