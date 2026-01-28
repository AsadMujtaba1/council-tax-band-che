import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface BandChangeData {
  year: number
  totalChallenges: number
  successfulChallenges: number
  successRate: number
  bandUpgrades: number
  bandDowngrades: number
}

interface BandChangeHistoryChartProps {
  data: BandChangeData[]
}

export function BandChangeHistoryChart({ data }: BandChangeHistoryChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    if (!container) return

    const width = container.clientWidth
    const height = 300
    const margin = { top: 20, right: 80, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.year.toString()))
      .range([0, innerWidth])
      .padding(0.3)

    const yScaleLeft = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.totalChallenges) || 0])
      .nice()
      .range([innerHeight, 0])

    const yScaleRight = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0])

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'oklch(0.50 0.02 250)')

    g.append('g')
      .call(
        d3.axisLeft(yScaleLeft)
          .ticks(5)
          .tickFormat((d) => d3.format(',')(d))
      )
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'oklch(0.50 0.02 250)')

    g.append('g')
      .attr('transform', `translate(${innerWidth}, 0)`)
      .call(
        d3.axisRight(yScaleRight)
          .ticks(5)
          .tickFormat((d) => `${d}%`)
      )
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'oklch(0.55 0.18 145)')

    g.selectAll('.domain, .tick line')
      .style('stroke', 'oklch(0.88 0.01 250)')

    const barGroup = g
      .selectAll('.bar-group')
      .data(data)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${xScale(d.year.toString())},0)`)

    const barWidth = xScale.bandwidth() / 2

    barGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', innerHeight)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', 'oklch(0.55 0.18 145)')
      .attr('rx', 3)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', (d) => yScaleLeft(d.successfulChallenges))
      .attr('height', (d) => innerHeight - yScaleLeft(d.successfulChallenges))

    barGroup
      .append('rect')
      .attr('x', barWidth)
      .attr('y', innerHeight)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', 'oklch(0.55 0.22 25)')
      .attr('opacity', 0.3)
      .attr('rx', 3)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', (d) => yScaleLeft(d.totalChallenges - d.successfulChallenges))
      .attr('height', (d) => innerHeight - yScaleLeft(d.totalChallenges - d.successfulChallenges))

    const line = d3
      .line<BandChangeData>()
      .x((d) => (xScale(d.year.toString()) || 0) + xScale.bandwidth() / 2)
      .y((d) => yScaleRight(d.successRate))
      .curve(d3.curveMonotoneX)

    const linePath = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.55 0.18 145)')
      .attr('stroke-width', 3)
      .attr('d', line)

    const totalLength = linePath.node()?.getTotalLength() || 0
    linePath
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1200)
      .delay(400)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    g.selectAll('.success-dot')
      .data(data)
      .join('circle')
      .attr('class', 'success-dot')
      .attr('cx', (d) => (xScale(d.year.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('cy', (d) => yScaleRight(d.successRate))
      .attr('r', 0)
      .attr('fill', 'oklch(0.55 0.18 145)')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .transition()
      .duration(400)
      .delay((d, i) => 1600 + i * 100)
      .attr('r', 6)

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 10}, ${margin.top + 40})`)

    const legendData = [
      { label: 'Successful', color: 'oklch(0.55 0.18 145)' },
      { label: 'Unsuccessful', color: 'oklch(0.55 0.22 25)', opacity: 0.3 },
      { label: 'Success Rate', color: 'oklch(0.55 0.18 145)', type: 'line' },
    ]

    legend
      .selectAll('g')
      .data(legendData)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .each(function (d) {
        const g = d3.select(this)

        if (d.type === 'line') {
          g.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 18)
            .attr('y2', 0)
            .attr('stroke', d.color)
            .attr('stroke-width', 3)
        } else {
          g.append('rect')
            .attr('x', 0)
            .attr('y', -6)
            .attr('width', 18)
            .attr('height', 12)
            .attr('fill', d.color)
            .attr('opacity', d.opacity || 1)
            .attr('rx', 2)
        }

        g.append('text')
          .attr('x', 24)
          .attr('y', 0)
          .attr('dy', '0.35em')
          .attr('font-size', '10px')
          .attr('fill', 'oklch(0.45 0.02 250)')
          .text(d.label)
      })

  }, [data])

  return (
    <div className="w-full">
      <svg ref={svgRef} width="100%" height="300" />
    </div>
  )
}
