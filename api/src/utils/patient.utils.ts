export const STATUS = {
  ALERT: "Alert",
  NORMAL: "Ok",
};

export const getStatus = (heartRate: number, oxygenLevel: number, bodyTemperature: number) => {
  if (heartRate < 60 || heartRate > 100) {
    return STATUS.ALERT;
  }

  if (oxygenLevel < 90) {
    return STATUS.ALERT;
  }

  if (bodyTemperature < 36.1 || bodyTemperature > 37.2) {
    return STATUS.ALERT;
  }

  return STATUS.NORMAL;
};
