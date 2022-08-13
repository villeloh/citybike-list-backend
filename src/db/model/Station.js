class Station {

  constructor(
    stationId, 
    nameFinnish, 
    nameSwedish, 
    nameEnglish, 
    addressFinnish, 
    addressSwedish, 
    operator, 
    capacity, 
    geoLocation) {
    this.stationId = stationId,
    this.nameFinnish = nameFinnish,
    this.nameSwedish = nameSwedish,
    this.nameEnglish = nameEnglish,
    this.addressFinnish = addressFinnish,
    this.addressSwedish = addressSwedish,
    this.operator = operator,
    this.capacity = capacity,
    this.geoLocation = geoLocation
  }
}

module.exports = Station;