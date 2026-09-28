import {
  ATTACK_LANE_WIDTH,
  LADDER_HEIGHT,
  LADDER_RIGHT,
  LADDER_TOTAL_WIDTH,
  getArrivalY,
  getDepartureY,
} from './boardLayout'
import { MOVES } from './moves'
import { BOTTOM_STEP, WIN_STEP, type SpecialStep } from './styles'

const CORNER_RADIUS = 6
const ARROWHEAD_LENGTH = 9
const ARROWHEAD_HALF_WIDTH = 5
const STROKE_WIDTH = 3.5
// A lane closer to the row edge than this would make the final run double back on
// itself between the last corner and the arrowhead.
const MIN_LANE_DISTANCE = CORNER_RADIUS + ARROWHEAD_LENGTH

interface ElbowArrowProps {
  edgeX: number
  laneX: number
  startY: number
  endY: number
  color: string
}

/**
 * Out of a row's edge to a lane beside the ladder, up the lane, and back into a higher
 * row, with rounded corners. The lane's side of the edge decides which way it bends.
 */
function buildElbowPath({ edgeX, laneX, startY, endY }: Omit<ElbowArrowProps, 'color'>): string {
  if (Math.abs(laneX - edgeX) < MIN_LANE_DISTANCE) {
    throw new Error(`Arrow lane at x=${laneX} is closer than ${MIN_LANE_DISTANCE}px to its row edge at x=${edgeX}`)
  }
  const direction = Math.sign(laneX - edgeX)
  return [
    `M ${edgeX} ${startY}`,
    `H ${laneX - direction * CORNER_RADIUS}`,
    `Q ${laneX} ${startY} ${laneX} ${startY - CORNER_RADIUS}`,
    `V ${endY + CORNER_RADIUS}`,
    `Q ${laneX} ${endY} ${laneX - direction * CORNER_RADIUS} ${endY}`,
    `H ${edgeX + direction * ARROWHEAD_LENGTH}`,
  ].join(' ')
}

function buildArrowheadPoints({ edgeX, laneX, endY }: Pick<ElbowArrowProps, 'edgeX' | 'laneX' | 'endY'>): string {
  const baseX = edgeX + Math.sign(laneX - edgeX) * ARROWHEAD_LENGTH
  return `${edgeX},${endY} ${baseX},${endY - ARROWHEAD_HALF_WIDTH} ${baseX},${endY + ARROWHEAD_HALF_WIDTH}`
}

function ElbowArrow({ color, ...geometry }: ElbowArrowProps) {
  return (
    <g>
      <path
        d={buildElbowPath(geometry)}
        fill="none"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={buildArrowheadPoints(geometry)} fill={color} />
    </g>
  )
}

const ATTACK_LANE_X = 8

/** One red arrow per step, each climbing one step: Attack's "go up 1", including into the trophy. */
export function AttackArrows() {
  const climbingSteps: number[] = []
  for (let step = BOTTOM_STEP; step < WIN_STEP; step += 1) climbingSteps.push(step)

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      width={ATTACK_LANE_WIDTH}
      height={LADDER_HEIGHT}
      viewBox={`0 0 ${ATTACK_LANE_WIDTH} ${LADDER_HEIGHT}`}
      aria-hidden="true"
    >
      {climbingSteps.map(step => (
        <ElbowArrow
          key={step}
          edgeX={ATTACK_LANE_WIDTH}
          laneX={ATTACK_LANE_X}
          startY={getDepartureY(step)}
          endY={getArrivalY(step + 1)}
          color={MOVES.attack.color}
        />
      ))}
    </svg>
  )
}

type ArrowSpan = Pick<SpecialStep, 'step' | 'destination'>

// Arrows leave a row's top half and arrive in its bottom half, so one arrow ending on a
// row and another starting there don't touch and can share a lane.
function doSpansOverlap(first: ArrowSpan, second: ArrowSpan): boolean {
  return first.step < second.destination && second.step < first.destination
}

/**
 * Packs the arrows into vertical lanes so no two arrows share a lane where their runs
 * overlap. Shorter arrows go first so they sit closest to the ladder.
 */
function assignArrowLanes(spans: ArrowSpan[]): Record<number, number> {
  const lanes: ArrowSpan[][] = []
  const laneByStep: Record<number, number> = {}
  const shortestFirst = [...spans].sort((a, b) => a.destination - a.step - (b.destination - b.step))

  for (const span of shortestFirst) {
    let laneIndex = lanes.findIndex(lane => lane.every(placed => !doSpansOverlap(placed, span)))
    if (laneIndex === -1) {
      laneIndex = lanes.length
      lanes.push([])
    }
    lanes[laneIndex].push(span)
    laneByStep[span.step] = laneIndex
  }
  return laneByStep
}

const FIRST_LANE_OFFSET = 20
const LANE_SPACING = 14

/** Purple Special arrows on the ladder's right side, from each step to where a winning Special leads. */
export function SpecialArrows({ specialSteps }: { specialSteps: SpecialStep[] }) {
  const laneByStep = assignArrowLanes(specialSteps)

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      width={LADDER_TOTAL_WIDTH}
      height={LADDER_HEIGHT}
      viewBox={`0 0 ${LADDER_TOTAL_WIDTH} ${LADDER_HEIGHT}`}
      aria-hidden="true"
    >
      {specialSteps.map(({ step, destination }) => (
        <ElbowArrow
          key={step}
          edgeX={LADDER_RIGHT}
          laneX={LADDER_RIGHT + FIRST_LANE_OFFSET + laneByStep[step] * LANE_SPACING}
          startY={getDepartureY(step)}
          endY={getArrivalY(destination)}
          color={MOVES.special.color}
        />
      ))}
    </svg>
  )
}
