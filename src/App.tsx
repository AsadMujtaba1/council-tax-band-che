'use client'
import React, { useState } from 'react'
import { Calculator, TrendUp, Info, Download, ArrowRight, CheckCircle, WarningCircle, MagnifyingGlass, MapPin, ChartBar } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PostcodeMap } from '@/components/PostcodeMap'
import { BandComparisonChart } from '@/components/BandComparisonChart'
import { BandDistributionChart } from '@/components/BandDistributionChart'
import { ProjectionChart } from '@/components/ProjectionChart'

/**
 * DATA SOURCES REQUIRED:
 * 1. Postcodes.io API - UK postcode validation and geographic data (region, local authority)
 * 2. Land Registry Benchmark JSON - Pre-calculated property values by postcode
 * 3. Council Tax Band Data Catalogue - Average rates by band and local authority
 * 4. Bank of England Benchmark JSON - Historical inflation data for trends
 * 5. Neighboring Postcodes Data - Geographic proximity data for regional comparisons (radius: 2.5 miles)
 * 
 * ToolData interface defined below - mock data provided for demo
 * Integration team: Replace fetchToolData with real API adapter
 */

interface PostcodeMeta {
  postcode: string
  latitude: number
  longitude: number
  region: string
  localAuthority: string
}

interface NeighborPostcodeData {
  postcode: string
  distance: number
  averageBand: string
  averageAnnualCostPence: number
  propertyCount: number
  localAuthority: string
}

interface CouncilTaxBandData {
  band: string
  averageAnnualCostPence: number
}

interface LandRegistryData {
  propertyValueEstimatePounds: number
}

interface InflationData {
  year: number
  inflationRatePercent: number
}

interface ToolData {
  postcodeMeta: PostcodeMeta
  councilTaxBandData: { [band: string]: CouncilTaxBandData }
  landRegistryData?: LandRegistryData
  inflationData: InflationData[]
  userCouncilTaxBand: string | null
  userAnnualCostPence: number | null
  averageAnnualCostPounds: number
  estimatedSavingsPounds: number
  neighboringPostcodes: NeighborPostcodeData[]
  usageCount: number
  averageRating: number
  ratingCount: number
  lastUpdated: string
  metadata: {
    lastUpdated: string
    dataSource: string
  }
}

interface FetchToolDataParams {
  postcode: string
  propertyType?: string
  propertyAge?: string
  currentBand?: string
}

const fetchToolData = async (params: FetchToolDataParams): Promise<ToolData> => {
  // TODO: Integration Team - Replace with real API calls
  // This mock simulates API delay and returns realistic data structure
  await new Promise(resolve => setTimeout(resolve, 800))

  const mockCouncilTaxBands: { [band: string]: CouncilTaxBandData } = {
    A: { band: 'A', averageAnnualCostPence: 120000 },
    B: { band: 'B', averageAnnualCostPence: 140000 },
    C: { band: 'C', averageAnnualCostPence: 160000 },
    D: { band: 'D', averageAnnualCostPence: 180000 },
    E: { band: 'E', averageAnnualCostPence: 220000 },
    F: { band: 'F', averageAnnualCostPence: 260000 },
    G: { band: 'G', averageAnnualCostPence: 320000 },
    H: { band: 'H', averageAnnualCostPence: 400000 }
  }

  const userBand = params.currentBand || 'D'
  const userCost = mockCouncilTaxBands[userBand].averageAnnualCostPence
  const averageCost = mockCouncilTaxBands['C'].averageAnnualCostPence
  const savingsPence = userCost - averageCost
  const savingsPounds = savingsPence > 0 ? savingsPence / 100 : 0

  const lowerBand = String.fromCharCode(userBand.charCodeAt(0) - 1)
  const potentialSavingsPence = lowerBand >= 'A' && mockCouncilTaxBands[lowerBand] 
    ? userCost - mockCouncilTaxBands[lowerBand].averageAnnualCostPence 
    : savingsPence

  const neighboringPostcodes: NeighborPostcodeData[] = [
    {
      postcode: 'SW1A 2AA',
      distance: 0.3,
      averageBand: 'E',
      averageAnnualCostPence: 200000,
      propertyCount: 342,
      localAuthority: 'Westminster'
    },
    {
      postcode: 'SW1P 1AA',
      distance: 0.8,
      averageBand: 'D',
      averageAnnualCostPence: 175000,
      propertyCount: 289,
      localAuthority: 'Westminster'
    },
    {
      postcode: 'SW1Y 4AA',
      distance: 1.2,
      averageBand: 'F',
      averageAnnualCostPence: 240000,
      propertyCount: 156,
      localAuthority: 'Westminster'
    },
    {
      postcode: 'SW1H 0AA',
      distance: 1.5,
      averageBand: 'C',
      averageAnnualCostPence: 165000,
      propertyCount: 478,
      localAuthority: 'Westminster'
    },
    {
      postcode: 'SE1 7AA',
      distance: 2.1,
      averageBand: 'C',
      averageAnnualCostPence: 155000,
      propertyCount: 521,
      localAuthority: 'Southwark'
    },
    {
      postcode: 'SW3 2AA',
      distance: 2.4,
      averageBand: 'G',
      averageAnnualCostPence: 295000,
      propertyCount: 234,
      localAuthority: 'Kensington and Chelsea'
    }
  ]

  return {
    postcodeMeta: {
      postcode: params.postcode.toUpperCase(),
      latitude: 51.5074,
      longitude: -0.1278,
      region: 'Greater London',
      localAuthority: 'Westminster'
    },
    councilTaxBandData: mockCouncilTaxBands,
    landRegistryData: {
      propertyValueEstimatePounds: 425000
    },
    inflationData: [
      { year: 2021, inflationRatePercent: 2.6 },
      { year: 2022, inflationRatePercent: 9.1 },
      { year: 2023, inflationRatePercent: 7.3 },
      { year: 2024, inflationRatePercent: 2.3 }
    ],
    userCouncilTaxBand: userBand,
    userAnnualCostPence: userCost,
    averageAnnualCostPounds: averageCost / 100,
    estimatedSavingsPounds: Math.max(potentialSavingsPence / 100, 0),
    neighboringPostcodes,
    usageCount: 23459,
    averageRating: 4.7,
    ratingCount: 1247,
    lastUpdated: new Date().toISOString(),
    metadata: {
      lastUpdated: 'January 2024',
      dataSource: 'Land Registry, Valuation Office Agency'
    }
  }
}

const validatePostcode = (postcode: string): boolean => {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
  return postcodeRegex.test(postcode.trim())
}

function App() {
  const [postcode, setPostcode] = useState('')
  const [propertyType, setPropertyType] = useState<string>()
  const [propertyAge, setPropertyAge] = useState<string>()
  const [currentBand, setCurrentBand] = useState<string>()
  const [data, setData] = useState<ToolData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidPostcode = postcode.trim().length > 0 && validatePostcode(postcode)

  const handleCheck = async () => {
    setError(null)
    
    if (!postcode.trim()) {
      setError('Please enter your postcode')
      return
    }

    if (!validatePostcode(postcode)) {
      setError('Please enter a valid UK postcode (e.g., SW1A 1AA)')
      return
    }

    setLoading(true)
    try {
      const result = await fetchToolData({
        postcode,
        propertyType,
        propertyAge,
        currentBand
      })
      setData(result)
    } catch (err) {
      setError('Unable to retrieve council tax data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!data) return

    const bands = Object.keys(data.councilTaxBandData).sort()
    const csvRows = [
      ['Band', 'Annual Cost (£)', 'vs Your Cost', 'Potential Savings (£)'],
      ...bands.map(band => {
        const bandData = data.councilTaxBandData[band]
        const cost = bandData.averageAnnualCostPence / 100
        const userCost = data.userAnnualCostPence ? data.userAnnualCostPence / 100 : cost
        const diff = userCost - cost
        const savings = diff > 0 ? diff.toFixed(2) : '0.00'
        return [band, cost.toFixed(2), diff > 0 ? `+£${diff.toFixed(2)}` : diff < 0 ? `-£${Math.abs(diff).toFixed(2)}` : '£0.00', savings]
      })
    ]

    const csv = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `council-tax-comparison-${data.postcodeMeta.postcode}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getBandComparison = () => {
    if (!data || !data.userCouncilTaxBand) return null

    const userBand = data.userCouncilTaxBand
    const userCost = data.userAnnualCostPence || 0
    const bands = Object.keys(data.councilTaxBandData).sort()
    const userIndex = bands.indexOf(userBand)
    
    return bands.map(band => {
      const bandData = data.councilTaxBandData[band]
      const cost = bandData.averageAnnualCostPence
      const savings = userCost - cost
      const isUserBand = band === userBand
      const isLower = bands.indexOf(band) < userIndex

      return {
        band,
        cost: cost / 100,
        savings: savings / 100,
        isUserBand,
        isLower,
        percentage: userCost > 0 ? (cost / userCost) * 100 : 100
      }
    })
  }

  const faqItems = [
    {
      question: 'How is my council tax band determined?',
      answer: 'Council tax bands are based on property value as of 1st April 1991 in England and Wales (1st April 2003 in Scotland). Properties are valued and assigned to bands A-H, with Band A being the lowest value properties and Band H the highest. Check your local council website for precise dates and band thresholds in your area.'
    },
    {
      question: 'Why do neighboring postcodes have different council tax costs?',
      answer: 'Council tax varies between areas due to two main factors: 1) Different local authorities set different rates based on their budgets and service levels, and 2) Property valuations can differ significantly even in nearby postcodes due to property types, sizes, and historical valuations. Even within the same local authority, different postcodes can have varying property band distributions.'
    },
    {
      question: 'Can I challenge my council tax band?',
      answer: 'Yes, you can challenge your band if you believe it is incorrect. Valid reasons include: significant changes to the property, similar properties in lower bands, or errors in the original valuation. The process varies by region - in England and Wales, contact the Valuation Office Agency (VOA). Note that challenging could result in a higher band if errors are found.'
    },
    {
      question: 'How can I save money on council tax?',
      answer: 'You might save by: 1) Challenging your band if incorrectly assessed, 2) Claiming eligible discounts (25% for single occupancy, student exemptions, disability reductions), 3) Ensuring you\'re on the correct payment plan, 4) Checking if you qualify for Council Tax Support based on income.'
    },
    {
      question: 'What is the average council tax in my area?',
      answer: 'This tool provides estimates based on publicly available data from the Land Registry and Valuation Office Agency. Average costs vary significantly by local authority and band. The estimates shown give you a sense of whether you might be overpaying compared to typical rates in your postcode area.'
    },
    {
      question: 'How accurate are the savings estimates?',
      answer: 'Estimates are based on average tax bands and local authority rates from government sources. Actual savings depend on successfully challenging your band, which isn\'t guaranteed. Success rates vary - properties with clear evidence of incorrect banding have higher success rates. Always verify exact figures with your local council.'
    },
    {
      question: 'Where does this tool get its data?',
      answer: 'We use publicly available data from: Postcodes.io (geographic data), Land Registry (property values), Valuation Office Agency (council tax bands), and Bank of England (inflation data). All sources are government or government-backed databases, updated quarterly or annually. Last update: January 2024.'
    }
  ]

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-5">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
            <Calculator className="w-7 h-7 text-primary" weight="duotone" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Council Tax Band Checker
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Find out if you're overpaying on council tax. Check your band against local averages and discover potential savings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1.5">
              <CheckCircle weight="fill" className="w-3.5 h-3.5" />
              Free UK Tool
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Info weight="fill" className="w-3.5 h-3.5" />
              Government Data
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              ⭐ {data?.averageRating || 4.7} ({(data?.ratingCount || 1247).toLocaleString()} reviews)
            </Badge>
          </div>
        </header>

        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MagnifyingGlass className="w-5 h-5" weight="duotone" />
              Check Your Council Tax Band
            </CardTitle>
            <CardDescription>
              Enter your postcode and property details to compare your council tax
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="postcode" className="text-sm">
                  Postcode <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="SW1A 1AA"
                  className="text-base mt-1"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="current-band" className="text-sm">
                    Your Current Band <span className="text-xs text-muted-foreground">(Optional)</span>
                  </Label>
                  <Select value={currentBand} onValueChange={setCurrentBand} disabled={loading}>
                    <SelectTrigger id="current-band" className="mt-1">
                      <SelectValue placeholder="Select band" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Band A</SelectItem>
                      <SelectItem value="B">Band B</SelectItem>
                      <SelectItem value="C">Band C</SelectItem>
                      <SelectItem value="D">Band D</SelectItem>
                      <SelectItem value="E">Band E</SelectItem>
                      <SelectItem value="F">Band F</SelectItem>
                      <SelectItem value="G">Band G</SelectItem>
                      <SelectItem value="H">Band H</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="property-type" className="text-sm">
                    Property Type <span className="text-xs text-muted-foreground">(Optional)</span>
                  </Label>
                  <Select value={propertyType} onValueChange={setPropertyType} disabled={loading}>
                    <SelectTrigger id="property-type" className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="bungalow">Bungalow</SelectItem>
                      <SelectItem value="maisonette">Maisonette</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheck}
              disabled={!isValidPostcode || loading}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Checking...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" weight="bold" />
                  Check My Council Tax
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <WarningCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {data && (
          <>
            <Card className="border-2 border-success bg-success/5">
              <CardContent className="pt-6 pb-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/20 mb-3">
                  <TrendUp className="w-7 h-7 text-success" weight="bold" />
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Potential Annual Savings
                </p>
                <p className="hero-metric text-4xl sm:text-5xl text-success mb-1">
                  £{data.estimatedSavingsPounds.toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  if you successfully challenge to a lower band
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Info className="w-4 h-4" weight="duotone" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-0.5">Postcode</p>
                      <p className="font-semibold">{data.postcodeMeta.postcode}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-0.5">Your Band</p>
                      <p className="font-semibold">Band {data.userCouncilTaxBand}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50 col-span-2">
                      <p className="text-xs text-muted-foreground mb-0.5">Local Authority</p>
                      <p className="font-semibold">{data.postcodeMeta.localAuthority}</p>
                    </div>
                  </div>
                  {data.landRegistryData && (
                    <div className="p-2 rounded bg-accent/10 border border-accent/20">
                      <p className="text-xs text-muted-foreground mb-0.5">Estimated Value</p>
                      <p className="text-lg font-bold text-accent">
                        £{data.landRegistryData.propertyValueEstimatePounds.toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Cost Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded bg-primary/10">
                      <span className="text-sm text-muted-foreground">Your Annual Cost</span>
                      <span className="text-lg font-bold text-primary hero-metric">
                        £{((data.userAnnualCostPence || 0) / 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Area Average</span>
                      <span className="text-lg font-bold hero-metric">
                        £{data.averageAnnualCostPounds.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-success/10">
                      <span className="text-sm text-muted-foreground">If Lower Band</span>
                      <span className="text-lg font-bold text-success hero-metric">
                        £{(((data.userAnnualCostPence || 0) - (data.estimatedSavingsPounds * 100)) / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ChartBar className="w-5 h-5" weight="duotone" />
                  Band Comparison Chart
                </CardTitle>
                <CardDescription className="text-sm">
                  Visual comparison of council tax costs across all bands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BandComparisonChart bands={getBandComparison() || []} />
              </CardContent>
            </Card>



            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">5-Year Cost Projection</CardTitle>
                <CardDescription className="text-sm">
                  How inflation affects your council tax over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectionChart
                  data={Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    const inflationRate = i === 0 ? 0 : 0.023
                    const currentCost = ((data.userAnnualCostPence || 0) / 100) * Math.pow(1 + inflationRate, i)
                    const lowerCost = currentCost - data.estimatedSavingsPounds
                    const annualSavings = data.estimatedSavingsPounds * Math.pow(1 + inflationRate, i)
                    
                    return {
                      year,
                      currentCost,
                      lowerCost,
                      savings: annualSavings,
                    }
                  })}
                />
                <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm font-semibold mb-1">💡 Long-term Impact</p>
                  <p className="text-sm text-muted-foreground">
                    Over 5 years, successfully challenging your band could save approximately £{(data.estimatedSavingsPounds * 5.1).toFixed(0)} (accounting for 2.3% annual inflation).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Band Distribution</CardTitle>
                <CardDescription className="text-sm">
                  Property characteristics and typical distribution by band
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BandDistributionChart
                  bands={[
                    { band: 'A', value: '< £40k', description: 'Small flats, terraced properties', percent: 24 },
                    { band: 'B', value: '£40k-£52k', description: 'Smaller terraced homes', percent: 20 },
                    { band: 'C', value: '£52k-£68k', description: 'Average family homes', percent: 22 },
                    { band: 'D', value: '£68k-£88k', description: 'Larger family homes', percent: 15 },
                    { band: 'E', value: '£88k-£120k', description: 'Detached properties', percent: 9 },
                    { band: 'F', value: '£120k-£160k', description: 'Large detached homes', percent: 5 },
                    { band: 'G', value: '£160k-£320k', description: 'Very large properties', percent: 4 },
                    { band: 'H', value: '> £320k', description: 'Premium properties', percent: 1 },
                  ]}
                  userBand={data.userCouncilTaxBand || 'D'}
                />
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { band: 'A', value: '< £40k', description: 'Small flats', percent: 24 },
                    { band: 'B', value: '£40k-£52k', description: 'Terraced', percent: 20 },
                    { band: 'C', value: '£52k-£68k', description: 'Family homes', percent: 22 },
                    { band: 'D', value: '£68k-£88k', description: 'Larger homes', percent: 15 },
                    { band: 'E', value: '£88k-£120k', description: 'Detached', percent: 9 },
                    { band: 'F', value: '£120k-£160k', description: 'Large detached', percent: 5 },
                    { band: 'G', value: '£160k-£320k', description: 'Very large', percent: 4 },
                    { band: 'H', value: '> £320k', description: 'Premium', percent: 1 },
                  ].map((item) => {
                    const isUserBand = item.band === data.userCouncilTaxBand
                    return (
                      <div
                        key={item.band}
                        className={`p-2 rounded border ${
                          isUserBand ? 'border-primary bg-primary/5' : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">Band {item.band}</span>
                          <span className="text-muted-foreground">{item.percent}%</span>
                        </div>
                        <p className="text-muted-foreground leading-tight">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Values based on 1991 property prices in England and Wales. {data.postcodeMeta.region} distribution may vary.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5" weight="duotone" />
                  Regional Comparison Map
                </CardTitle>
                <CardDescription className="text-sm">
                  See how council tax costs vary in nearby areas (within 2.5 miles)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PostcodeMap
                  centerPostcode={data.postcodeMeta.postcode}
                  centerLat={data.postcodeMeta.latitude}
                  centerLng={data.postcodeMeta.longitude}
                  neighboringPostcodes={data.neighboringPostcodes}
                  userBand={data.userCouncilTaxBand || 'D'}
                  userCostPence={data.userAnnualCostPence || 0}
                />

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-muted-foreground mb-0.5">Lowest Nearby</p>
                    <p className="text-xl font-bold text-success hero-metric">
                      £{Math.min(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence / 100)).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {data.neighboringPostcodes.find(n => n.averageAnnualCostPence === Math.min(...data.neighboringPostcodes.map(x => x.averageAnnualCostPence)))?.postcode}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-muted-foreground mb-0.5">Highest Nearby</p>
                    <p className="text-xl font-bold text-destructive hero-metric">
                      £{Math.max(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence / 100)).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {data.neighboringPostcodes.find(n => n.averageAnnualCostPence === Math.max(...data.neighboringPostcodes.map(x => x.averageAnnualCostPence)))?.postcode}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-0.5">Range</p>
                    <p className="text-xl font-bold text-primary hero-metric">
                      £{((Math.max(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence)) - 
                         Math.min(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence))) / 100).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">variation</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm">View Detailed Breakdown ({data.neighboringPostcodes.length} areas)</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {data.neighboringPostcodes.map((neighbor) => {
                          const costDiff = neighbor.averageAnnualCostPence - (data.userAnnualCostPence || 0)
                          const isMoreExpensive = costDiff > 0
                          const isSameAuthority = neighbor.localAuthority === data.postcodeMeta.localAuthority
                          
                          return (
                            <div
                              key={neighbor.postcode}
                              className="p-3 rounded-lg border border-border bg-card"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-sm font-bold">{neighbor.postcode}</h4>
                                    {!isSameAuthority && (
                                      <Badge variant="outline" className="text-xs">
                                        {neighbor.localAuthority}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {neighbor.distance} mi • {neighbor.propertyCount.toLocaleString()} properties
                                  </p>
                                </div>
                                <Badge variant="secondary" className="font-bold text-xs">
                                  Band {neighbor.averageBand}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold data-table">
                                  £{(neighbor.averageAnnualCostPence / 100).toFixed(0)}/yr
                                </span>
                                <span className={`text-xs font-semibold ${isMoreExpensive ? 'text-destructive' : 'text-success'}`}>
                                  ({isMoreExpensive ? '+' : ''}£{Math.abs(costDiff / 100).toFixed(0)})
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendUp className="w-5 h-5" weight="duotone" />
                  Historical Trends
                </CardTitle>
                <CardDescription className="text-sm">
                  Council tax inflation over recent years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {data.inflationData.map((item) => (
                    <div key={item.year} className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">{item.year}</p>
                      <p className="text-xl font-bold">{item.inflationRatePercent.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/30 rounded">
                  💡 Council tax typically rises with inflation. Challenging your band now locks in long-term savings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ArrowRight className="w-5 h-5" weight="bold" />
                  Next Steps
                </CardTitle>
                <CardDescription className="text-sm">
                  How to challenge your council tax band
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-accent/10 text-center">
                    <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                      1
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Check Neighbours</h4>
                    <p className="text-xs text-muted-foreground">
                      Compare similar properties nearby
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 text-center">
                    <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                      2
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Gather Evidence</h4>
                    <p className="text-xs text-muted-foreground">
                      Collect proof and documentation
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 text-center">
                    <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                      3
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Submit Challenge</h4>
                    <p className="text-xs text-muted-foreground">
                      Contact VOA or use a service
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button variant="default" size="sm" className="w-full">
                    <span className="text-sm">DIY Guide (Free)</span>
                  </Button>
                  <Button variant="default" size="sm" className="w-full">
                    <span className="text-sm">Professional Service</span>
                  </Button>
                </div>

                <Button onClick={handleDownloadCSV} variant="outline" size="sm" className="w-full gap-2">
                  <Download className="w-4 h-4" weight="bold" />
                  Download Report (CSV)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <div className="text-center space-y-1 text-sm text-muted-foreground">
              <p>Data: {data.metadata.dataSource} • Updated: {data.metadata.lastUpdated}</p>
              <p>⭐ {data.averageRating} ({data.ratingCount.toLocaleString()} reviews) • {data.usageCount.toLocaleString()} users</p>
            </div>
          </>
        )}

        {!data && !loading && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-3">
                <Calculator className="w-7 h-7 text-muted-foreground" weight="duotone" />
              </div>
              <h3 className="text-base font-semibold mb-1">Ready to Check Your Council Tax?</h3>
              <p className="text-sm text-muted-foreground">
                Enter your postcode above to discover potential savings
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
