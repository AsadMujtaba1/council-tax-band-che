import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface BandData {
  band: string
  cost: number
  savings: number
  isUserBand: boolean
  isLower: boolean
  percentage: number
}

interface BandComparisonChartProps {
  bands: BandData[]
}

export function BandComparisonChart({ bands }: BandComparisonChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !bands.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    if (!container) return

    const width = container.clientWidth
    const height = 320
    const margin = { top: 20, right: 60, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleBand()
      .domain(bands.map((d) => d.band))
      .range([0, innerWidth])
      .padding(0.3)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bands, (d) => d.cost) || 0])
      .nice()
      .range([innerHeight, 0])

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('fill', 'oklch(0.45 0.02 250)')

    g.append('g')
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `£${d3.format(',')(d)}`)
      )
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'oklch(0.50 0.02 250)')

    g.selectAll('.domain, .tick line')
      .style('stroke', 'oklch(0.88 0.01 250)')

    const bars = g
      .selectAll('rect')
      .data(bands)
      .join('rect')
      .attr('x', (d) => xScale(d.band) || 0)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', (d) =>
        d.isUserBand
          ? 'oklch(0.45 0.15 250)'
          : d.isLower
          ? 'oklch(0.55 0.18 145)'
          : 'oklch(0.50 0.02 250)'
      )
      .attr('opacity', 0.9)
      .attr('rx', 4)

    bars
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('y', (d) => yScale(d.cost))
      .attr('height', (d) => innerHeight - yScale(d.cost))

    const labels = g
      .selectAll('text.value-label')
      .data(bands)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', (d) => (xScale(d.band) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight)
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('fill', 'oklch(0.35 0.02 250)')
      .style('opacity', 0)
      .text((d) => `£${d3.format(',')(d.cost)}`)

    labels
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 400)
      .attr('y', (d) => yScale(d.cost))
      .style('opacity', 1)

    const userBandIndex = bands.findIndex((d) => d.isUserBand)
    if (userBandIndex !== -1) {
      const userBand = bands[userBandIndex]
      const xPos = (xScale(userBand.band) || 0) + xScale.bandwidth() / 2

      g.append('line')
        .attr('x1', xPos)
        .attr('y1', yScale(userBand.cost))
        .attr('x2', xPos)
        .attr('y2', yScale(userBand.cost))
        .attr('stroke', 'oklch(0.45 0.15 250)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4')
        .transition()
        .duration(600)
        .delay(800)
        .attr('y2', innerHeight)

      g.append('text')
        .attr('x', xPos + 10)
        .attr('y', yScale(userBand.cost) - 5)
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', 'oklch(0.45 0.15 250)')
        .style('opacity', 0)
        .text('Your Band')
        .transition()
        .duration(400)
        .delay(1000)
        .style('opacity', 1)
    }

  }, [bands])

  return (
    <div className="w-full">
      <svg ref={svgRef} width="100%" height="320" />
    </div>
  )
}
