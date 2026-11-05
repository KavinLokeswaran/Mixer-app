/**
 * Matte for platene (jog wheels). Ren logikk, så den kan testes.
 * En «tur» er én hel runde rundt platen.
 */

/** En vinylplate går 33⅓ runder i minuttet ved normal fart. */
export const PLATTER_TURNS_PER_SECOND = 100 / 3 / 60

/** Hvor fort lyden kan dras under scratch (ganger normal fart). */
export const MAX_SCRATCH_RATE = 8

/** Hvor raskt lyden tar igjen hånda under scratch (sekunder). Lavere = strammere, men hakkete. */
const SCRATCH_CATCH_UP = 0.035

/** Hvor mye platekanten skyver tempoet per runde i sekundet. */
const NUDGE_PER_TURN = 0.2
/** Mest kanten kan skyve: 30 % raskere eller saktere. */
export const MAX_NUDGE = 0.3

/** Hvor mye skyv-knappene endrer tempoet mens de holdes inne. */
export const NUDGE_BUTTON = 0.04

const clamp = (x: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, x))

export function turnsToSeconds(turns: number): number {
  return turns / PLATTER_TURNS_PER_SECOND
}

/** Vinkelen platen står i (grader, 0–360) når låten er på `position` sekunder. */
export function platterAngle(position: number): number {
  const turns = position * PLATTER_TURNS_PER_SECOND
  return (turns - Math.floor(turns)) * 360
}

/**
 * Forskjellen mellom to vinkler (radianer) i turer, alltid den korteste veien (-0,5 … 0,5).
 * Positiv = med klokka = fremover i låten.
 */
export function turnDelta(fromRad: number, toRad: number): number {
  const turns = (toRad - fromRad) / (2 * Math.PI)
  return turns - Math.round(turns)
}

/**
 * Farten lyden skal ha for å følge hånda under scratch. `target` er der hånda har dratt
 * platen til, `position` er der lyden er nå. Lyden tar igjen hånda mykt i stedet for å hoppe.
 */
export function scratchRate(target: number, position: number): number {
  return clamp((target - position) / SCRATCH_CATCH_UP, -MAX_SCRATCH_RATE, MAX_SCRATCH_RATE)
}

/** Skyv fra platekanten ut fra hvor fort kanten dreies (turer i sekundet). */
export function nudgeFromSpin(turnsPerSecond: number): number {
  return clamp(turnsPerSecond * NUDGE_PER_TURN, -MAX_NUDGE, MAX_NUDGE)
}

/**
 * Motoren i platespilleren. Den drar platen opp i fart når du trykker play,
 * og tar igjen fart etter at du har holdt i platen eller kastet den bakover.
 * Grunnkraft (fart per sekund) pluss litt ekstra jo lenger unna farten er.
 */
const MOTOR_FORCE = 5
const MOTOR_PULL = 2
/** Bremsen (og friksjonen når motoren er av): litt mykere, så du hører den gå ned. */
const BRAKE_FORCE = 2.2
const BRAKE_PULL = 1.5

/**
 * Farten (1 = normal, negativ = baklengs) platen har etter `dt` sekunder når den slippes fri.
 * Med motoren på dras den mot `target`, ellers bremser den mot 0. Går aldri forbi målet.
 */
export function spinToward(speed: number, target: number, dt: number, motorOn: boolean): number {
  const diff = target - speed
  if (diff === 0) return target
  const force = motorOn ? MOTOR_FORCE + MOTOR_PULL * Math.abs(diff) : BRAKE_FORCE + BRAKE_PULL * Math.abs(diff)
  const step = force * dt
  return Math.abs(diff) <= step ? target : speed + Math.sign(diff) * step
}

/** Glatter ut en verdi mot et mål. `dt` i sekunder, `time` er tidskonstanten. */
export function approach(current: number, target: number, dt: number, time: number): number {
  return target + (current - target) * Math.exp(-dt / time)
}
