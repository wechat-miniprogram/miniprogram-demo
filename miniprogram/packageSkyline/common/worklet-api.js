function foo() {}

function bar() {
  'worklet';
}

export const worklet = {
  shared: foo,
  derived: foo,
  delay: bar,
  repeat: bar,
  sequence: bar,
  spring: bar,
  timing: bar,
  decay: bar,
  Easing: {},
};

export const router = {
  addRouteBuilder: foo,
  removeRouteBuilder: foo,
  getRouteContext: foo,
};

if (wx.worklet) {
  Object.assign(worklet, wx.worklet);
}

if (wx.router) {
  Object.assign(router, wx.router);
}

export function supportWorklet() {
  return typeof wx.worklet === 'object' && typeof wx.worklet.shared === 'function';
}
