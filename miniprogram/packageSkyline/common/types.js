export const GestureState = {
  POSSIBLE: 0, // 0 此时手势未识别，如 panDown等
  BEGIN: 1, // 1 手势已识别
  ACTIVE: 2, // 2 连续手势活跃状态
  END: 3, // 3 手势终止
  CANCELLED: 4, // 4 手势取消，
}

export const IPointerEvent = {
  identifier: 'number',
  type: 'string',
  deltaX: 'number',
  deltaY: 'number',
  localX: 'number',
  localY: 'number',
  clientX: 'number',
  clientY: 'number',
  radiusX: 'number',
  radiusY: 'number',
  rotationAngle: 'number',
  tilt: 'number',
  force: 'number',
  timeStamp: 'number',
};
