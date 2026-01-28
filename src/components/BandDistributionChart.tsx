import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface BandDistributionProps {
  bands: Array<{
    band: string
    value: string
    description: string
    percent: number
  }>
  userBand: string
}

export function BandDistributionChart({ bands, userBand }: BandDistributionProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !bands.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 400
    const height = 300
    const radius = Math.min(width, height) / 2 - 20

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(bands.map((d) => d.band))
      .range([
        'oklch(0.55 0.18 145)',
        'oklch(0.60 0.15 160)',
        'oklch(0.65 0.15 190)',
        'oklch(0.45 0.15 250)',
        'oklch(0.65 0.15 30)',
        'oklch(0.60 0.18 25)',
        'oklch(0.55 0.22 25)',
        'oklch(0.50 0.20 20)',
      ])

    const pie = d3
      .pie<{ band: string; percent: number }>()
      .value((d) => d.percent)
      .sort(null)

    const arc = d3
      .arc<d3.PieArcDatum<{ band: string; percent: number }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius)

    const outerArc = d3
      .arc<d3.PieArcDatum<{ band: string; percent: number }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 1.05)

    const arcs = g
      .selectAll('.arc')
      .data(pie(bands.map((b) => ({ band: b.band, percent: b.percent }))))
      .join('g')
      .attr('class', 'arc')

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.data.band))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', (d) => (d.data.band === userBand ? 1 : 0.7))
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).transition().duration(200).attr('opacity', 1)
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', d.data.band === userBand ? 1 : 0.7)
      })
      .transition()
      .duration(800)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return function (t) {
          return arc(interpolate(t)) || ''
        }
      })

    arcs
      .append('text')
      .attr('transform', (d) => {
        const pos = arc.centroid(d)
        return `translate(${pos})`
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('font-weight', '700')
      .style('fill', 'white')
      .style('opacity', 0)
      .text((d) => `${d.data.band}`)
      .transition()
      .duration(400)
      .delay(800)
      .style('opacity', 1)

    arcs
      .append('text')
      .attr('transform', (d) => {
        const pos = arc.centroid(d)
        return `translate(${pos[0]},${pos[1] + 15})`
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('opacity', 0)
      .text((d) => `${d.data.percent}%`)
      .transition()
      .duration(400)
      .delay(1000)
      .style('opacity', 0.9)

    const userBandData = bands.find((b) => b.band === userBand)
    if (userBandData) {
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', 'oklch(0.50 0.02 250)')
        .text('Your Band')

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.2em')
        .style('font-size', '28px')
        .style('font-weight', '700')
        .style('fill', 'oklch(0.45 0.15 250)')
        .text(userBand)
    }

  }, [bands, userBand])

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} width="400" height="300" />
    </div>
  )
}
