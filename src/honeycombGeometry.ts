export type Axial = readonly [number, number]
export type Point = { x: number; y: number; key: string }
export const combLayouts = {
  three: [[0, 0], [1, 0], [0, 1]],
  seven: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [-1, 1], [0, 2]],
  five: [[0, 0], [1, 0], [1, -1], [2, -1], [0, 1]],
  four: [[0, 0], [0, 1], [1, 0], [1, -1]],
  two: [[0, 0], [1, -1]],
} as const satisfies Record<string, readonly Axial[]>
export type CombLayout = keyof typeof combLayouts
const root3 = Math.sqrt(3)
const noise = (x: number, y: number, seed: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  return (value - Math.floor(value)) * 2 - 1
}

// True axial tessellation. Shared corners are perturbed ONCE, then reused by
// every neighbour. Independent cell offsets/rotations would create gaps.
export function createHoneycomb(layout: readonly Axial[], radius = 30, seed = 1) {
  const vertices = new Map<string, Point>()
  const edges = new Map<string, { from: Point; to: Point; owners: number[] }>()
  const corners = [[2, 0], [1, 1], [-1, 1], [-2, 0], [-1, -1], [1, -1]]
  const cells = layout.map(([q, r], index) => {
    const points = corners.map(([dx, dy]) => {
      const vx = q * 3 + dx, vy = r * 2 + q + dy, key = `${vx},${vy}`
      if (!vertices.has(key)) vertices.set(key, {
        key, x: vx * radius / 2 + noise(vx, vy, seed) * radius * .023,
        y: vy * root3 * radius / 2 + noise(vx, vy, seed + 13) * radius * .023,
      })
      return vertices.get(key)!
    })
    points.forEach((from, side) => {
      const to = points[(side + 1) % 6], key = [from.key, to.key].sort().join('|')
      const edge = edges.get(key)
      if (edge) edge.owners.push(index)
      else edges.set(key, { from, to, owners: [index] })
    })
    return { q, r, points, d: `M${points.map(p => `${p.x},${p.y}`).join('L')}Z`, cx: q * 1.5 * radius, cy: (r + q / 2) * root3 * radius }
  })
  const points = [...vertices.values()], edgeList = [...edges.values()]
  const x = Math.min(...points.map(p => p.x)), y = Math.min(...points.map(p => p.y))
  const width = Math.max(...points.map(p => p.x)) - x, height = Math.max(...points.map(p => p.y)) - y
  return {
    cells, vertices: points, edges: edgeList, bounds: { x, y, width, height },
    outline: edgeList.map(({ from, to }) => `M${from.x},${from.y}L${to.x},${to.y}`).join(''),
    silhouette: cells.map(cell => cell.d).join(''),
    bottom: points.reduce((lowest, point) => point.y > lowest.y ? point : lowest),
  }
}
