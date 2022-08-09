class Trip {

  constructor(depTime, retTime, depStationId, depStationName, retStationId, retStationName, dist, dura) {
    this.departureTime = depTime;
    this.returnTime = retTime;
    this.depStationId = depStationId;
    this.depStationName = depStationName;
    this.retStationId = retStationId;
    this.retStationName = retStationName;
    this.distance = dist;
    this.duration = dura;
  }
}