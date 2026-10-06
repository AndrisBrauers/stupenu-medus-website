import assert from 'node:assert/strict'
import { combLayouts, createHoneycomb } from '../src/honeycombGeometry.ts'

for (const [name, layout] of Object.entries(combLayouts)) {
  for (const seed of [2, 4, 7, 11, 13, 17, 19]) {
    const mesh = createHoneycomb(layout, 30, seed)
    assert.equal(mesh.vertices.length - mesh.edges.length + mesh.cells.length, 1, `${name}: connected disk, no interior gaps`)
    assert.ok(mesh.edges.every(edge => edge.owners.length === 1 || edge.owners.length === 2), 'Every wall borders one or two cells')
    mesh.cells.forEach(cell => {
      assert.equal(cell.points.length, 6, 'Every cell has six sides')
      cell.points.forEach((a, i) => {
        const b = cell.points[(i + 1) % 6], c = cell.points[(i + 2) % 6]
        assert.ok((b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x) > 0, 'Organic variation keeps cells convex')
      })
    })
    for (let a = 0; a < layout.length; a++) for (let b = a + 1; b < layout.length; b++) {
      const dq = layout[a][0] - layout[b][0], dr = layout[a][1] - layout[b][1]
      const neighbour = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr)) === 1
      const shared = mesh.cells[a].points.filter(point => mesh.cells[b].points.includes(point))
      if (neighbour) assert.equal(shared.length, 2, `${name}: adjacent cells reuse both exact wall endpoints`)
      else assert.ok(shared.length <= 1, `${name}: distant cells never overlap`)
    }
  }
}
console.log('PASS: all five cluster shapes, seven seeds; six-sided convex cells, exact shared walls, no holes or triangular gaps.')
