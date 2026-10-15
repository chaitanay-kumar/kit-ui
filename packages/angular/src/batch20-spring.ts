/** Exact damped-spring step, in seconds. Scoped to the two batch-20 ports. */
export interface Batch20Spring { value: number; target: number; velocity: number; restDelta?: number; restSpeed?: number }
export function stepBatch20Spring(axis: Batch20Spring, dt: number, stiffness: number, damping: number, mass: number): boolean {
  const x = axis.value - axis.target, v = axis.velocity;
  const decay = damping / (2 * mass), discriminant = decay * decay - stiffness / mass;
  let y: number, velocity: number;
  if (Math.abs(discriminant) < 1e-9) {
    const c = v + decay * x, exponential = Math.exp(-decay * dt);
    y = (x + c * dt) * exponential;
    velocity = (c - decay * (x + c * dt)) * exponential;
  } else if (discriminant < 0) {
    const frequency = Math.sqrt(-discriminant), c = (v + decay * x) / frequency, exponential = Math.exp(-decay * dt);
    y = exponential * (x * Math.cos(frequency * dt) + c * Math.sin(frequency * dt));
    velocity = -decay * y + exponential * frequency * (-x * Math.sin(frequency * dt) + c * Math.cos(frequency * dt));
  } else {
    const root = Math.sqrt(discriminant), r1 = -decay + root, r2 = -decay - root;
    const c1 = (v - r2 * x) / (r1 - r2), c2 = x - c1;
    y = c1 * Math.exp(r1 * dt) + c2 * Math.exp(r2 * dt);
    velocity = r1 * c1 * Math.exp(r1 * dt) + r2 * c2 * Math.exp(r2 * dt);
  }
  axis.value = axis.target + y;
  axis.velocity = velocity;
  if (Math.abs(y) <= (axis.restDelta ?? .005) && Math.abs(velocity) <= (axis.restSpeed ?? .01)) {
    axis.value = axis.target;
    axis.velocity = 0;
    return false;
  }
  return true;
}
