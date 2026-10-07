'use client'

import { useEffect, useRef } from 'react'

// Deep Cardong-blue paint finish: slow liquid highlights computed on a small field and upscaled for a silky surface.
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    const out = c?.getContext('2d')
    if (!c || !out) return
    const W = 200
    const H = 110
    const buf = document.createElement('canvas')
    buf.width = W
    buf.height = H
    const b = buf.getContext('2d')!
    const img = b.createImageData(W, H)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ramp = [[6, 14, 40], [10, 26, 74], [20, 52, 150], [47, 92, 214], [150, 186, 250], [236, 242, 255]]
    const col = (v: number) => {
      v = Math.max(0, Math.min(0.9999, v)) * (ramp.length - 1)
      const i = v | 0
      const f = v - i
      const a = ramp[i]
      const d = ramp[i + 1]
      return [a[0] + (d[0] - a[0]) * f, a[1] + (d[1] - a[1]) * f, a[2] + (d[2] - a[2]) * f]
    }
    let t = 0
    let raf = 0
    const frame = () => {
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const u = x / W
          const v = y / H
          let f =
            Math.sin(u * 2.6 + t * 0.7 + Math.sin(v * 2.1 - t * 0.4) * 1.7) +
            Math.sin(v * 3.6 - t * 0.5 + Math.sin(u * 2.4 + t * 0.3) * 1.5) * 0.8 +
            Math.sin((u * 1.3 + v) * 2.0 + t * 0.25) * 0.6
          f = (f + 2.4) / 4.8
          f = Math.pow(f, 2.4) * (0.55 + 0.6 * u)
          const sheen = Math.pow(Math.max(0, Math.sin(f * 10 + t * 0.2)), 22) * 0.28 * u
          const k = (y * W + x) * 4
          const cc = col(f * 0.85 + sheen)
          img.data[k] = cc[0]
          img.data[k + 1] = cc[1]
          img.data[k + 2] = cc[2]
          img.data[k + 3] = 255
        }
      b.putImageData(img, 0, 0)
      const dpr = Math.min(1.5, devicePixelRatio || 1)
      const w = Math.round(c.clientWidth * dpr)
      const h = Math.round(c.clientHeight * dpr)
      if (c.width !== w || c.height !== h) {
        c.width = w
        c.height = h
      }
      out.imageSmoothingEnabled = true
      out.imageSmoothingQuality = 'high'
      out.drawImage(buf, 0, 0, w, h)
      t += 0.0045
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    frame()
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={ref} aria-hidden="true" />
}
