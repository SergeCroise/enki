export const VEHICLE_MODE = Object.freeze({
  BUS: 'bus',
  WATER: 'water'
});

export const VEHICLE_SUBMODE = Object.freeze({
  AIRPORT_LINK_BUS: 'airportLinkBus',
  EXPRESS_BUS: 'expressBus',
  LOCAL_BUS: 'localBus',
  NIGHT_BUS: 'nightBus',
  RAIL_REPLACEMENT_BUS: 'railReplacementBus',
  REGIONAL_BUS: 'regionalBus',
  SCHOOL_BUS: 'schoolBus',
  SHUTTLE_BUS: 'shuttleBus',
  SIGHTSEEING_BUS: 'sightseeingBus',
  LOCAL_PASSENGER_FERRY: 'localPassengerFerry',
  SIGHTSEEING_SERVICE: 'sightseeingService'
});

export const FLEXIBLE_LINE_TYPE = Object.freeze({
  CORRIDOR_SERVICE: 'corridorService',
  MAIN_ROUTE_WITH_FLEXIBLE_ENDS: 'mainRouteWithFlexibleEnds',
  FLEXIBLE_AREAS_ONLY: 'flexibleAreasOnly',
  HAIL_AND_RIDE_SECTIONS: 'hailAndRideSections',
  FIXED_STOP_AREA_WIDE: 'fixedStopAreaWide',
  FREE_AREA_AREA_WIDE: 'freeAreaAreaWide',
  MIXED_FLEXIBLE: 'mixedFlexible',
  MIXED_FLEXIBLE_AND_FIXED: 'mixedFlexibleAndFixed',
  FIXED: 'fixed',
  OTHER: 'other'
});

export const DAY_OF_WEEK = Object.freeze({
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday'
});

export const BOOKING_METHOD = Object.freeze({
  CALL_DRIVER: 'callDriver',
  CALL_OFFICE: 'callOffice',
  ONLINE: 'online',
  PHONE_AT_STOP: 'phoneAtStop',
  TEXT: 'text'
});

export const BOOKING_ACCESS = Object.freeze({
  PUBLIC: 'public',
  AUTHORISED_PUBLIC: 'authorisedPublic',
  STAFF: 'staff'
});

export const PURCHASE_WHEN = Object.freeze({
  TIME_OF_TRAVEL_ONLY: 'timeOfTravelOnly',
  DAY_OF_TRAVEL_ONLY: 'dayOfTravelOnly',
  UNTIL_PREVIOUS_DAY: 'untilPreviousDay',
  ADVANCE_AND_DAY_OF_TRAVEL: 'advanceAndDayOfTravel'
});

export const PURCHASE_MOMENT = Object.freeze({
  ON_RESERVATION: 'onReservation',
  BEFORE_BOARDING: 'beforeBoarding',
  AFTER_BOARDING: 'afterBoarding',
  ON_CHECK_OUT: 'onCheckOut'
});
