export type Bounds = { x: number; y: number; width: number; height: number }
export type LabelPlacement = { x: number; y: number; scale: number }

// Intrinsic dimensions and landmarks from the supplied 208 × 180 logo.
// These paths never change. All presentation and motion use uniform scale.
export const LABEL_WIDTH = 208
export const LABEL_HEIGHT = 180
export const LABEL_RATIO = LABEL_WIDTH / LABEL_HEIGHT
export const LABEL_VIEW_BOX = `0 0 ${LABEL_WIDTH} ${LABEL_HEIGHT}`
export const LABEL_SURFACE = 'M52 0H89C98 0 104 6 104 15C104 6 110 0 119 0H156L208 90L156 180H52L0 90Z'
export const LABEL_DROP = 'M104 15C104 24 95 31 95 37C95 49 113 49 113 37C113 31 104 24 104 15Z'

export function labelPlacement(bounds: Bounds): LabelPlacement {
  const scale = Math.min(bounds.width / LABEL_WIDTH, bounds.height / LABEL_HEIGHT)
  return { x: bounds.x + (bounds.width - LABEL_WIDTH * scale) / 2, y: bounds.y + (bounds.height - LABEL_HEIGHT * scale) / 2, scale }
}

export function interpolatePlacement(from: LabelPlacement, to: LabelPlacement, progress: number): LabelPlacement {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
    scale: from.scale + (to.scale - from.scale) * progress,
  }
}

export function expandedPlacement(): LabelPlacement {
  const width = window.innerWidth
  const height = window.innerHeight
  const labelWidth = Math.max(width * 1.92, height * 1.6 * LABEL_RATIO)
  const labelHeight = labelWidth / LABEL_RATIO
  return { x: (width - labelWidth) / 2, y: -labelHeight * .305, scale: labelWidth / LABEL_WIDTH }
}
