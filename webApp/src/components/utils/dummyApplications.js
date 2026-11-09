// dummyApplications.js
const DAY = 24 * 60 * 60 * 1000

// small seeded random so the data stays the same on every refresh
const seeded = (seed) => () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

export const makeDummyApplications = () => {
  const rand = seeded(42)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const list = []

  const add = (daysAgo, hour = 10 + Math.floor(rand() * 8)) => {
    const d = new Date(today.getTime() - daysAgo * DAY)
    d.setHours(hour, Math.floor(rand() * 60), 0, 0)
    // never put a time in the future for today's entries
    if (d > now) d.setTime(now.getTime() - 60 * 1000)
    list.push({ id: list.length + 1, appliedAt: d.toISOString() })
  }

  for (let daysAgo = 365; daysAgo >= 0; daysAgo--) {
    const r = rand()
    const dayOfWeek = new Date(today.getTime() - daysAgo * DAY).getDay()
    const weekend = dayOfWeek === 0 || dayOfWeek === 6

    // quiet period roughly 4 to 5 months ago, to show a gap in the chart
    if (daysAgo > 120 && daysAgo < 150) continue

    // recent months are busier
    const busy = daysAgo < 90 ? 0.55 : 0.3
    if (r > busy) continue

    const max = weekend ? 1 : daysAgo < 90 ? 5 : 3
    const count = 1 + Math.floor(rand() * max)
    for (let i = 0; i < count; i++) add(daysAgo)
  }

  // edge checks: first cell and last cell of the heatmap
  add(365, 9)
  add(0, 8)

  return list
}