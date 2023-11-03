export enum DriverStatus {
  OnDuty = 1,
  OffDuty = 2,
  Terminated = 3,
  IndefiniteLeave = 4
}

export enum DriverStatus2 {
  InTransitWithPassenger = 1,
  InTransitWithoutPassenger = 2,
  WaitingForNextTrip = 3,
  WaitingForPassenger = 4,
  Offline = 5,
  Emergency = 6
}
