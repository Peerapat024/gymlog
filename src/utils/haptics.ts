/* ── Haptic feedback ──────────────────────────────────────────────────────────
   iOS Safari 17.4+: toggling <input type="checkbox" switch> fires the Taptic Engine
   Android Chrome: navigator.vibrate() fallback
   Silent on unsupported devices.
────────────────────────────────────────────────────────────────────────────── */
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Create one persistent switch element instead of creating/removing every tap
let _input: HTMLInputElement | null = null;
let _label: HTMLLabelElement | null = null;

const getLabel = () => {
  if (!_label) {
    const id = '__haptic';
    _input = document.createElement('input');
    _input.type = 'checkbox';
    _input.setAttribute('switch', '');
    _input.id = id;
    Object.assign(_input.style, { position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', opacity: '0.001', pointerEvents: 'none', zIndex: '-1' });
    _label = document.createElement('label');
    _label.setAttribute('for', id);
    Object.assign(_label.style, { position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', opacity: '0.001', pointerEvents: 'none', zIndex: '-1' });
    document.body.appendChild(_input);
    document.body.appendChild(_label);
  }
  return _label!;
};

const iosHaptic = (count = 1, delayMs = 65) => {
  const label = getLabel();
  const fire = () => label.click();
  fire();
  for (let i = 1; i < count; i++) setTimeout(fire, i * delayMs);
};

const vib = (p: number | number[]) => navigator.vibrate && navigator.vibrate(p);

export const haptic = {
  tick:    () => isIOS ? iosHaptic(1)     : vib(4),
  light:   () => isIOS ? iosHaptic(1)     : vib(8),
  medium:  () => isIOS ? iosHaptic(1)     : vib(18),
  heavy:   () => isIOS ? iosHaptic(2, 50) : vib(35),
  success: () => isIOS ? iosHaptic(2, 80) : vib([12, 60, 18]),
  pr:      () => isIOS ? iosHaptic(3, 60) : vib([20, 40, 30, 40, 50]),
};
