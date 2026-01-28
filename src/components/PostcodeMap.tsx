import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface PostcodeMapProps {
  centerPostcode: string
  centerLat: number
  centerLng: number
  neighboringPostcodes: Array<{
    postcode: string
    distance: number
    averageBand: string
    averageAnnualCostPence: number
    propertyCount: number
    localAuthority: string
    latitude?: number
    longitude?: number
  }>
  userBand: string
  userCostPence: number
}

const bandColors: { [key: string]: string } = {
  A: '#10b981',
  B: '#34d399',
  C: '#6ee7b7',
  D: '#fbbf24',
  E: '#fb923c',
  F: '#f97316',
  G: '#ef4444',
  H: '#dc2626',
}

export function PostcodeMap({
  centerPostcode,
  centerLat,
  centerLng,
  neighboringPostcodes,
  userBand,
  userCostPence,
}: PostcodeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedPostcode, setSelectedPostcode] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [showHeatmap, setShowHeatmap] = useState(true)

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: Math.min(container.clientWidth * 0.75, 500),
          })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const allPostcodes = [
      {
        postcode: centerPostcode,
        latitude: centerLat,
        longitude: centerLng,
        averageBand: userBand,
        averageAnnualCostPence: userCostPence,
        distance: 0,
        propertyCount: 0,
        localAuthority: '',
        isCenter: true,
      },
      ...neighboringPostcodes.map((p, i) => {
        const angle = (i / neighboringPostcodes.length) * Math.PI * 2
        const adjustedDistance = Math.sqrt(p.distance)
        return {
          ...p,
          latitude: centerLat + Math.cos(angle) * adjustedDistance * 0.02,
          longitude: centerLng + Math.sin(angle) * adjustedDistance * 0.03,
          isCenter: false,
        }
      }),
    ]

    const latExtent = d3.extent(allPostcodes, (d) => d.latitude) as [number, number]
    const lngExtent = d3.extent(allPostcodes, (d) => d.longitude) as [number, number]

    const latPadding = (latExtent[1] - latExtent[0]) * 0.2
    const lngPadding = (lngExtent[1] - lngExtent[0]) * 0.2

    const xScale = d3
      .scaleLinear()
      .domain([lngExtent[0] - lngPadding, lngExtent[1] + lngPadding])
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([latExtent[1] + latPadding, latExtent[0] - latPadding])
      .range([0, innerHeight])

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'oklch(0.97 0.005 250)')
      .attr('stroke', 'oklch(0.88 0.01 250)')
      .attr('stroke-width', 1)
      .attr('rx', 8)

    const defs = svg.append('defs')

    const costExtent = d3.extent(allPostcodes, (d) => d.averageAnnualCostPence) as [number, number]
    const heatmapColorScale = d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([costExtent[1], costExtent[0]])

    allPostcodes.forEach((postcode) => {
      const gradientId = `gradient-${postcode.postcode.replace(/\s/g, '')}`
      const gradient = defs
        .append('radialGradient')
        .attr('id', gradientId)

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', bandColors[postcode.averageBand])
        .attr('stop-opacity', 0.3)

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', bandColors[postcode.averageBand])
        .attr('stop-opacity', 0)
    })

    const voronoi = d3.Delaunay.from(
      allPostcodes,
      (d) => xScale(d.longitude),
      (d) => yScale(d.latitude)
    ).voronoi([0, 0, innerWidth, innerHeight])

    if (showHeatmap) {
      const heatmapCells = g
        .append('g')
        .attr('class', 'heatmap-layer')
        .selectAll('path')
        .data(allPostcodes)
        .join('path')
        .attr('d', (d, i) => voronoi.renderCell(i))
        .attr('fill', (d) => heatmapColorScale(d.averageAnnualCostPence))
        .attr('opacity', 0.4)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.3)

      const gridSize = 30
      const heatmapData: Array<{ x: number; y: number; value: number }> = []
      
      for (let x = 0; x < innerWidth; x += gridSize) {
        for (let y = 0; y < innerHeight; y += gridSize) {
          let totalWeight = 0
          let weightedSum = 0
          
          allPostcodes.forEach((p) => {
            const px = xScale(p.longitude)
            const py = yScale(p.latitude)
            const distance = Math.sqrt(Math.pow(x + gridSize / 2 - px, 2) + Math.pow(y + gridSize / 2 - py, 2))
            const maxDistance = Math.sqrt(Math.pow(innerWidth, 2) + Math.pow(innerHeight, 2)) * 0.3
            
            if (distance < maxDistance) {
              const weight = Math.pow(1 - distance / maxDistance, 2)
              totalWeight += weight
              weightedSum += p.averageAnnualCostPence * weight
            }
          })
          
          if (totalWeight > 0) {
            heatmapData.push({
              x,
              y,
              value: weightedSum / totalWeight,
            })
          }
        }
      }

      g.append('g')
        .attr('class', 'heatmap-grid')
        .selectAll('rect')
        .data(heatmapData)
        .join('rect')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('width', gridSize)
        .attr('height', gridSize)
        .attr('fill', (d) => heatmapColorScale(d.value))
        .attr('opacity', 0.15)
        .attr('pointer-events', 'none')
        .lower()
    }

    g.append('g')
      .selectAll('path')
      .data(allPostcodes)
      .join('path')
      .attr('d', (d, i) => voronoi.renderCell(i))
      .attr('fill', (d) => `url(#gradient-${d.postcode.replace(/\s/g, '')})`)
      .attr('stroke', 'none')
      .attr('opacity', showHeatmap ? 0.5 : 1)

    const costScale = d3
      .scaleSqrt()
      .domain([
        d3.min(allPostcodes, (d) => d.averageAnnualCostPence) || 0,
        d3.max(allPostcodes, (d) => d.averageAnnualCostPence) || 1,
      ])
      .range([8, 24])

    const nodes = g
      .append('g')
      .selectAll('circle')
      .data(allPostcodes)
      .join('circle')
      .attr('cx', (d) => xScale(d.longitude))
      .attr('cy', (d) => yScale(d.latitude))
      .attr('r', (d) => (d.isCenter ? 20 : costScale(d.averageAnnualCostPence)))
      .attr('fill', (d) => bandColors[d.averageBand])
      .attr('stroke', (d) => (d.isCenter ? 'oklch(0.45 0.15 250)' : 'white'))
      .attr('stroke-width', (d) => (d.isCenter ? 4 : 2))
      .attr('cursor', 'pointer')
      .attr('opacity', 0.9)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d as any).isCenter ? 24 : costScale((d as any).averageAnnualCostPence) * 1.3)
          .attr('opacity', 1)
          .attr('stroke-width', (d as any).isCenter ? 5 : 3)

        setSelectedPostcode((d as any).postcode)
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d as any).isCenter ? 20 : costScale((d as any).averageAnnualCostPence))
          .attr('opacity', 0.9)
          .attr('stroke-width', (d as any).isCenter ? 4 : 2)
      })

    const labels = g
      .append('g')
      .selectAll('text')
      .data(allPostcodes)
      .join('text')
      .attr('x', (d) => xScale(d.longitude))
      .attr('y', (d) => yScale(d.latitude))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d) => (d.isCenter ? '12px' : '10px'))
      .attr('font-weight', (d) => (d.isCenter ? 'bold' : 'normal'))
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text((d) => d.averageBand)

    g.append('g')
      .selectAll('line')
      .data(allPostcodes.filter((d) => !d.isCenter))
      .join('line')
      .attr('x1', xScale(centerLng))
      .attr('y1', yScale(centerLat))
      .attr('x2', (d) => xScale(d.longitude))
      .attr('y2', (d) => yScale(d.latitude))
      .attr('stroke', 'oklch(0.88 0.01 250)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.3)
      .lower()

    const legend = svg
      .append('g')
      .attr('transform', `translate(${margin.left + 10}, ${margin.top + 10})`)

    const legendData = [
      { label: 'Lower Cost (A-C)', color: bandColors.A },
      { label: 'Medium Cost (D-E)', color: bandColors.D },
      { label: 'Higher Cost (F-H)', color: bandColors.G },
    ]

    legend
      .selectAll('g')
      .data(legendData)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${i * 22})`)
      .each(function (d) {
        const g = d3.select(this)

        g.append('circle')
          .attr('cx', 8)
          .attr('cy', 0)
          .attr('r', 6)
          .attr('fill', d.color)
          .attr('stroke', 'white')
          .attr('stroke-width', 1.5)

        g.append('text')
          .attr('x', 20)
          .attr('y', 0)
          .attr('dy', '0.35em')
          .attr('font-size', '11px')
          .attr('fill', 'oklch(0.45 0.02 250)')
          .text(d.label)
      })

  }, [centerPostcode, centerLat, centerLng, neighboringPostcodes, userBand, userCostPence, dimensions, showHeatmap])

  const selected = selectedPostcode
    ? [
        { postcode: centerPostcode, averageBand: userBand, averageAnnualCostPence: userCostPence, isCenter: true },
        ...neighboringPostcodes,
      ].find((p) => p.postcode === selectedPostcode)
    : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Cost Density Heatmap</span>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          >
            {showHeatmap ? '🔥 Hide Heatmap' : '🗺️ Show Heatmap'}
          </button>
        </div>
        {showHeatmap && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Cost:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(0, 158, 115)' }} />
              <span className="text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(240, 228, 66)' }} />
              <span className="text-muted-foreground">Med</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(213, 94, 0)' }} />
              <span className="text-muted-foreground">High</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <svg ref={svgRef} width="100%" height={dimensions.height || 500} />
      </div>

      {selected && (
        <div className="p-4 rounded-lg border-2 border-primary bg-primary/5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-bold">{selected.postcode}</h4>
                {(selected as any).isCenter && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                    Your Postcode
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-0.5">Average Band</p>
                  <p className="font-bold text-lg">Band {selected.averageBand}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Annual Cost</p>
                  <p className="font-bold text-lg">£{(selected.averageAnnualCostPence / 100).toFixed(0)}</p>
                </div>
                {!(selected as any).isCenter && (
                  <>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Distance</p>
                      <p className="font-semibold">{(selected as any).distance.toFixed(1)} miles</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Properties</p>
                      <p className="font-semibold">{(selected as any).propertyCount.toLocaleString()}</p>
                    </div>
                  </>
                )}
              </div>
              {!(selected as any).isCenter && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${
                      selected.averageAnnualCostPence < userCostPence
                        ? 'bg-success/20 text-success'
                        : selected.averageAnnualCostPence > userCostPence
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {selected.averageAnnualCostPence < userCostPence ? '↓' : selected.averageAnnualCostPence > userCostPence ? '↑' : '='}
                    £{Math.abs((selected.averageAnnualCostPence - userCostPence) / 100).toFixed(0)}
                    {selected.averageAnnualCostPence < userCostPence
                      ? ' less than your area'
                      : selected.averageAnnualCostPence > userCostPence
                      ? ' more than your area'
                      : ' same as your area'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p className="mb-2 font-semibold text-foreground">How to read this map:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>
            <strong>Circle size</strong> represents the average annual council tax cost
          </li>
          <li>
            <strong>Circle color</strong> shows the average band (green = lower, red = higher)
          </li>
          {showHeatmap && (
            <li>
              <strong>Heatmap overlay</strong> shows cost density interpolated across the region
            </li>
          )}
          <li>
            <strong>Your postcode</strong> is marked with a blue border in the center
          </li>
          <li>
            <strong>Hover</strong> over any circle to see detailed information
          </li>
        </ul>
      </div>
    </div>
  )
}
