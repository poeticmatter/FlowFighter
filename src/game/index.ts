import type { GameModule } from '../platform/types'
import { FlowBoard } from './Board'
import { flowRules } from './rules'
import { FlowSettingsForm } from './SettingsForm'
import type { FlowPlan, FlowSettings, FlowState } from './types'

export const game: GameModule<FlowSettings, FlowState, FlowPlan> = {
  rules: flowRules,
  defaultSettings: { styles: { 1: 'crane', 2: 'tiger' } },
  SettingsForm: FlowSettingsForm,
  Board: FlowBoard,
}

export type GameSettings = FlowSettings
export type GameState = FlowState
export type GamePlan = FlowPlan
