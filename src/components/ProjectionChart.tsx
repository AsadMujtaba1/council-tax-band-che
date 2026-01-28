import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ProjectionData {
  year: number
  currentCost: number
  lowerCost: number
  savings: number
}

interface ProjectionChartProps {
  data: ProjectionData[]
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    if (!container) return

    const width = container.clientWidth
    const height = 280
    const margin = { top: 20, right: 80, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.currentCost) || 0])
      .nice()
      .range([innerHeight, 0])

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format('d')))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', 'oklch(0.50 0.02 250)')

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

    const area = d3
      .area<ProjectionData>()
      .x((d) => xScale(d.year))
      .y0((d) => yScale(d.lowerCost))
      .y1((d) => yScale(d.currentCost))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(data)
      .attr('fill', 'oklch(0.55 0.18 145)')
      .attr('opacity', 0.2)
      .attr('d', area)

    const currentLine = d3
      .line<ProjectionData>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.currentCost))
      .curve(d3.curveMonotoneX)

    const lowerLine = d3
      .line<ProjectionData>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.lowerCost))
      .curve(d3.curveMonotoneX)

    const currentPath = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.45 0.15 250)')
      .attr('stroke-width', 3)
      .attr('d', currentLine)

    const lowerPath = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.55 0.18 145)')
      .attr('stroke-width', 3)
      .attr('d', lowerLine)

    const totalLength1 = currentPath.node()?.getTotalLength() || 0
    currentPath
      .attr('stroke-dasharray', totalLength1 + ' ' + totalLength1)
      .attr('stroke-dashoffset', totalLength1)
      .transition()
      .duration(1200)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    const totalLength2 = lowerPath.node()?.getTotalLength() || 0
    lowerPath
      .attr('stroke-dasharray', totalLength2 + ' ' + totalLength2)
      .attr('stroke-dashoffset', totalLength2)
      .transition()
      .duration(1200)
      .delay(200)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    g.selectAll('.dot-current')
      .data(data)
      .join('circle')
      .attr('class', 'dot-current')
      .attr('cx', (d) => xScale(d.year))
      .attr('cy', (d) => yScale(d.currentCost))
      .attr('r', 0)
      .attr('fill', 'oklch(0.45 0.15 250)')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .transition()
      .duration(400)
      .delay((d, i) => 1200 + i * 100)
      .attr('r', 5)

    g.selectAll('.dot-lower')
      .data(data)
      .join('circle')
      .attr('class', 'dot-lower')
      .attr('cx', (d) => xScale(d.year))
      .attr('cy', (d) => yScale(d.lowerCost))
      .attr('r', 0)
      .attr('fill', 'oklch(0.55 0.18 145)')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .transition()
      .duration(400)
      .delay((d, i) => 1400 + i * 100)
      .attr('r', 5)

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 10}, ${margin.top})`)

    const legendData = [
      { label: 'Current Band', color: 'oklch(0.45 0.15 250)' },
      { label: 'Lower Band', color: 'oklch(0.55 0.18 145)' },
    ]

    legend
      .selectAll('g')
      .data(legendData)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${i * 24})`)
      .each(function (d) {
        const g = d3.select(this)

        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 20)
          .attr('y2', 0)
          .attr('stroke', d.color)
          .attr('stroke-width', 3)

        g.append('text')
          .attr('x', 25)
          .attr('y', 0)
          .attr('dy', '0.35em')
          .attr('font-size', '11px')
          .attr('fill', 'oklch(0.45 0.02 250)')
          .text(d.label)
      })

  }, [data])

  return (
    <div className="w-full">
      <svg ref={svgRef} width="100%" height="280" />
    </div>
  )
}
