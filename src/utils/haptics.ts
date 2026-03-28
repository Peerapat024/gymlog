/* ── Haptic feedback ──────────────────────────────────────────────────────────
   iOS Safari 18+: label.click() on a hidden <input switch> fires the Taptic Engine
   Android Chrome: navigator.vibrate() fallback
   Silent on unsupported devices.
────────────────────────────────────────────────────────────────────────────── */
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const iosHaptic = (count = 1, delayMs = 65) => {
  const fire = () => {
    const id = '_h' + Math.random().toString(36).slice(2);
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.id = id;
    Object.assign(input.style, {
      position: 'fixed', left: '-9999px', top: '0',
      width: '1px', height: '1px', opacity: '0.01',
      pointerEvents: 'none',
    });
    const label = document.createElement('label');
    label.setAttribute('for', id);
    Object.assign(label.style, {
      position: 'fixed', left: '-9999px', top: '0',
      width: '1px', height: '1px', opacity: '0.01',
      pointerEvents: 'none',
    });
    document.body.appendChild(input);
    document.body.appendChild(label);
    label.click();
    setTimeout(() => { input.remove(); label.remove(); }, 100);
  };
  fire();
  for (let i = 1; i < count; i++) setTimeout(fire, i * delayMs);
};

const vib = (p: number | number[]) => navigator.vibrate && navigator.vibrate(p);

export const haptic = {
  tick:    () => isIOS ? iosHaptic(1)    : vib(4),
  light:   () => isIOS ? iosHaptic(1)    : vib(8),
  medium:  () => isIOS ? iosHaptic(1)    : vib(18),
  heavy:   () => isIOS ? iosHaptic(2, 50) : vib(35),
  success: () => isIOS ? iosHaptic(2, 80) : vib([12, 60, 18]),
  pr:      () => isIOS ? iosHaptic(3, 60) : vib([20, 40, 30, 40, 50]),
};
