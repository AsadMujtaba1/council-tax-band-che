'use client'
import React, { useState } from 'react'
import { Calculator, TrendUp, Info, Download, ArrowRight, CheckCircle, WarningCircle, MagnifyingGlass, MapPin } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PostcodeMap } from '@/components/PostcodeMap'

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Calculator className="w-8 h-8 text-primary" weight="duotone" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Council Tax Band Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find out if you're overpaying on council tax. Check your band against local averages and discover potential savings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MagnifyingGlass className="w-5 h-5" weight="duotone" />
              Check Your Council Tax Band
            </CardTitle>
            <CardDescription>
              Enter your postcode and property details to compare your council tax
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="postcode" className="text-base">
                  Postcode <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">Enter your UK postcode (e.g., SW1A 1AA)</p>
                <Input
                  id="postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="SW1A 1AA"
                  className="text-lg"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-band" className="text-base">
                    Your Current Band <span className="text-sm text-muted-foreground">(Optional)</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">If known, helps estimate savings</p>
                  <Select value={currentBand} onValueChange={setCurrentBand} disabled={loading}>
                    <SelectTrigger id="current-band">
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
                  <Label htmlFor="property-type" className="text-base">
                    Property Type <span className="text-sm text-muted-foreground">(Optional)</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">Helps refine estimates</p>
                  <Select value={propertyType} onValueChange={setPropertyType} disabled={loading}>
                    <SelectTrigger id="property-type">
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

              <div>
                <Label htmlFor="property-age" className="text-base">
                  Property Age <span className="text-sm text-muted-foreground">(Optional)</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">When was the property built?</p>
                <Select value={propertyAge} onValueChange={setPropertyAge} disabled={loading}>
                  <SelectTrigger id="property-age">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-1900">Pre-1900</SelectItem>
                    <SelectItem value="1900-1930">1900-1930</SelectItem>
                    <SelectItem value="1930-1960">1930-1960</SelectItem>
                    <SelectItem value="1960-1990">1960-1990</SelectItem>
                    <SelectItem value="post-1990">Post-1990</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCheck}
              disabled={!isValidPostcode || loading}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Checking Your Band...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" weight="bold" />
                  Check My Council Tax
                </>
              )}
            </Button>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <WarningCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {data && (
          <>
            <Card className="border-2 border-success bg-success/5">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
                  <TrendUp className="w-8 h-8 text-success" weight="bold" />
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Potential Annual Savings
                </p>
                <p className="hero-metric text-5xl sm:text-6xl text-success mb-2">
                  £{data.estimatedSavingsPounds.toFixed(0)}
                </p>
                <p className="text-muted-foreground">
                  if you successfully challenge to a lower band
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" weight="duotone" />
                  Your Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Postcode</p>
                    <p className="text-lg font-semibold">{data.postcodeMeta.postcode}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Local Authority</p>
                    <p className="text-lg font-semibold">{data.postcodeMeta.localAuthority}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Region</p>
                    <p className="text-lg font-semibold">{data.postcodeMeta.region}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Your Current Band</p>
                    <p className="text-lg font-semibold">Band {data.userCouncilTaxBand}</p>
                  </div>
                </div>
                {data.landRegistryData && (
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Property Value</p>
                    <p className="text-2xl font-bold text-accent">
                      £{data.landRegistryData.propertyValueEstimatePounds.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Based on Land Registry data</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Council Tax Band Comparison</CardTitle>
                <CardDescription>
                  See how your band compares to others in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getBandComparison()?.map((item) => (
                    <div
                      key={item.band}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        item.isUserBand
                          ? 'border-primary bg-primary/5'
                          : item.isLower
                          ? 'border-success/50 bg-success/5'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold">Band {item.band}</span>
                          {item.isUserBand && (
                            <Badge variant="default">Your Band</Badge>
                          )}
                          {item.isLower && (
                            <Badge variant="outline" className="border-success text-success">
                              Lower Band
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold data-table">
                            £{item.cost.toFixed(0)}
                          </p>
                          <p className="text-xs text-muted-foreground">per year</p>
                        </div>
                      </div>
                      {!item.isUserBand && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              {item.savings > 0 ? 'Potential Savings' : 'Additional Cost'}
                            </span>
                            <span className={`font-semibold ${item.savings > 0 ? 'text-success' : 'text-destructive'}`}>
                              {item.savings > 0 ? '+' : ''}£{Math.abs(item.savings).toFixed(0)}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${item.savings > 0 ? 'bg-success' : 'bg-destructive'}`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Your Annual Cost</p>
                    <p className="text-3xl font-bold text-primary hero-metric">
                      £{((data.userAnnualCostPence || 0) / 100).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Band {data.userCouncilTaxBand}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Area Average</p>
                    <p className="text-3xl font-bold text-secondary hero-metric">
                      £{data.averageAnnualCostPounds.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Band C (typical)</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">If Lower Band</p>
                    <p className="text-3xl font-bold text-accent hero-metric">
                      £{(((data.userAnnualCostPence || 0) - (data.estimatedSavingsPounds * 100)) / 100).toFixed(0)}
                    </p>
                    <p className="text-xs text-success mt-1">Save £{data.estimatedSavingsPounds.toFixed(0)}/year</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Visual Band Comparison</CardTitle>
                <CardDescription>
                  Bar chart showing annual costs across all bands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getBandComparison()?.map((item) => {
                    const maxCost = Math.max(...(getBandComparison()?.map(b => b.cost) || []))
                    const widthPercent = (item.cost / maxCost) * 100
                    
                    return (
                      <div key={item.band} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-semibold ${item.isUserBand ? 'text-primary' : 'text-foreground'}`}>
                            Band {item.band}
                          </span>
                          <span className="font-bold data-table">£{item.cost.toFixed(0)}</span>
                        </div>
                        <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                          <div
                            className={`h-full flex items-center px-3 transition-all duration-500 ${
                              item.isUserBand
                                ? 'bg-primary'
                                : item.isLower
                                ? 'bg-success'
                                : 'bg-secondary'
                            }`}
                            style={{ width: `${widthPercent}%` }}
                          >
                            {item.isUserBand && (
                              <span className="text-xs font-semibold text-primary-foreground">Your Band</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    🔵 Your current band &nbsp;|&nbsp; 🟢 Lower bands (potential savings) &nbsp;|&nbsp; ⚫ Higher bands
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5-Year Cost Projection</CardTitle>
                <CardDescription>
                  How inflation affects your council tax over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full data-table">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-3 px-2 text-sm font-semibold">Year</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold">Current Band {data.userCouncilTaxBand}</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold">If Lower Band</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold">Annual Savings</th>
                        <th className="text-right py-3 px-2 text-sm font-semibold">Cumulative</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() + i
                        const inflationRate = i === 0 ? 0 : 0.023
                        const currentCost = ((data.userAnnualCostPence || 0) / 100) * Math.pow(1 + inflationRate, i)
                        const lowerCost = currentCost - data.estimatedSavingsPounds
                        const annualSavings = data.estimatedSavingsPounds * Math.pow(1 + inflationRate, i)
                        const cumulative = data.estimatedSavingsPounds * ((Math.pow(1 + inflationRate, i + 1) - 1) / inflationRate)
                        
                        return (
                          <tr key={year} className="border-b border-border/50">
                            <td className="py-3 px-2 font-semibold">{year}</td>
                            <td className="text-right py-3 px-2">£{currentCost.toFixed(0)}</td>
                            <td className="text-right py-3 px-2 text-success font-semibold">£{lowerCost.toFixed(0)}</td>
                            <td className="text-right py-3 px-2 text-accent font-semibold">£{annualSavings.toFixed(0)}</td>
                            <td className="text-right py-3 px-2 text-primary font-bold">£{cumulative.toFixed(0)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm font-semibold mb-1">💡 Long-term Impact</p>
                  <p className="text-sm text-muted-foreground">
                    Over 5 years, successfully challenging your band could save you approximately £{(data.estimatedSavingsPounds * 5.1).toFixed(0)} (accounting for 2.3% annual inflation).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Band Distribution Insights</CardTitle>
                <CardDescription>
                  Typical property characteristics by band
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { band: 'A', value: '< £40k', description: 'Small flats, terraced properties', percent: 24 },
                    { band: 'B', value: '£40k-£52k', description: 'Smaller terraced homes', percent: 20 },
                    { band: 'C', value: '£52k-£68k', description: 'Average family homes', percent: 22 },
                    { band: 'D', value: '£68k-£88k', description: 'Larger family homes', percent: 15 },
                    { band: 'E', value: '£88k-£120k', description: 'Detached properties', percent: 9 },
                    { band: 'F', value: '£120k-£160k', description: 'Large detached homes', percent: 5 },
                    { band: 'G', value: '£160k-£320k', description: 'Very large properties', percent: 4 },
                    { band: 'H', value: '> £320k', description: 'Premium properties', percent: 1 },
                  ].map((item) => {
                    const isUserBand = item.band === data.userCouncilTaxBand
                    return (
                      <div
                        key={item.band}
                        className={`p-4 rounded-lg border ${
                          isUserBand ? 'border-primary bg-primary/5 border-2' : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold">Band {item.band}</span>
                              {isUserBand && <Badge variant="default" className="text-xs">You</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.value}</p>
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">{item.percent}%</span>
                        </div>
                        <p className="text-sm text-foreground/80">{item.description}</p>
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={isUserBand ? 'bg-primary' : 'bg-secondary'}
                            style={{ width: `${item.percent * 4}%`, height: '100%' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Values based on 1991 property prices in England and Wales. {data.postcodeMeta.region} distribution may vary.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" weight="duotone" />
                  Neighboring Postcodes Comparison
                </CardTitle>
                <CardDescription>
                  See how council tax costs vary in nearby areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 Council tax can vary significantly between neighboring postcodes due to different local authorities and property valuations. Compare your area with nearby locations.
                    </p>
                  </div>

                  <div className="p-6 bg-card rounded-lg border-2 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" weight="fill" />
                      Interactive Regional Map
                    </h3>
                    <PostcodeMap
                      centerPostcode={data.postcodeMeta.postcode}
                      centerLat={data.postcodeMeta.latitude}
                      centerLng={data.postcodeMeta.longitude}
                      neighboringPostcodes={data.neighboringPostcodes}
                      userBand={data.userCouncilTaxBand || 'D'}
                      userCostPence={data.userAnnualCostPence || 0}
                    />
                  </div>

                  <div className="space-y-3">
                    {data.neighboringPostcodes.map((neighbor) => {
                      const costDiff = neighbor.averageAnnualCostPence - (data.userAnnualCostPence || 0)
                      const isMoreExpensive = costDiff > 0
                      const isSameAuthority = neighbor.localAuthority === data.postcodeMeta.localAuthority
                      
                      return (
                        <div
                          key={neighbor.postcode}
                          className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-bold">{neighbor.postcode}</h4>
                                {!isSameAuthority && (
                                  <Badge variant="outline" className="text-xs">
                                    {neighbor.localAuthority}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {neighbor.distance} miles away • {neighbor.propertyCount.toLocaleString()} properties
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-0.5">Average Band</p>
                              <Badge variant="secondary" className="font-bold">
                                Band {neighbor.averageBand}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-xs text-muted-foreground mb-1">Average Cost</p>
                              <p className="text-xl font-bold data-table">
                                £{(neighbor.averageAnnualCostPence / 100).toFixed(0)}
                              </p>
                              <p className="text-xs text-muted-foreground">per year</p>
                            </div>
                            <div className={`p-3 rounded-lg ${isMoreExpensive ? 'bg-destructive/10' : 'bg-success/10'}`}>
                              <p className="text-xs text-muted-foreground mb-1">vs Your Cost</p>
                              <p className={`text-xl font-bold data-table ${isMoreExpensive ? 'text-destructive' : 'text-success'}`}>
                                {isMoreExpensive ? '+' : ''}£{Math.abs(costDiff / 100).toFixed(0)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isMoreExpensive ? 'more expensive' : 'less expensive'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isMoreExpensive ? 'bg-destructive' : 'bg-success'}`}
                              style={{ 
                                width: `${Math.min((Math.abs(costDiff) / (data.userAnnualCostPence || 1)) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Regional Insights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-xs text-muted-foreground mb-1">Lowest Nearby</p>
                        <p className="text-2xl font-bold text-accent hero-metric">
                          £{Math.min(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence / 100)).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {data.neighboringPostcodes.find(n => n.averageAnnualCostPence === Math.min(...data.neighboringPostcodes.map(x => x.averageAnnualCostPence)))?.postcode}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-xs text-muted-foreground mb-1">Highest Nearby</p>
                        <p className="text-2xl font-bold text-secondary hero-metric">
                          £{Math.max(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence / 100)).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {data.neighboringPostcodes.find(n => n.averageAnnualCostPence === Math.max(...data.neighboringPostcodes.map(x => x.averageAnnualCostPence)))?.postcode}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Average Range</p>
                        <p className="text-2xl font-bold text-primary hero-metric">
                          £{((Math.max(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence)) - 
                             Math.min(...data.neighboringPostcodes.map(n => n.averageAnnualCostPence))) / 100).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">variation</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Band Distribution Map</h4>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((band) => {
                        const count = data.neighboringPostcodes.filter(n => n.averageBand === band).length
                        const percentage = (count / data.neighboringPostcodes.length) * 100
                        
                        return (
                          <div key={band} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold">Band {band}</span>
                              <span className="text-muted-foreground">
                                {count} area{count !== 1 ? 's' : ''} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  band === data.userCouncilTaxBand
                                    ? 'bg-primary'
                                    : 'bg-secondary'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendUp className="w-5 h-5" weight="duotone" />
                  Historical Council Tax Trends
                </CardTitle>
                <CardDescription>
                  How council tax has changed over the last few years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.inflationData.map((item, index) => {
                    const isLatest = index === data.inflationData.length - 1
                    return (
                      <div key={item.year} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-semibold text-muted-foreground">
                          {item.year}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Inflation Rate</span>
                            <span className="text-sm font-bold">
                              {item.inflationRatePercent.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isLatest ? 'bg-accent' : 'bg-secondary'}`}
                              style={{ width: `${Math.min((item.inflationRatePercent / 10) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                  💡 Council tax typically rises with inflation. Challenging your band now could save you money for years to come.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" weight="bold" />
                  Next Steps: Challenge Your Band
                </CardTitle>
                <CardDescription>
                  If you think you're in the wrong band, here's what to do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Check Neighbouring Properties</h4>
                      <p className="text-sm text-muted-foreground">
                        Look up similar properties nearby on the VOA website to see if they're in lower bands
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Gather Evidence</h4>
                      <p className="text-sm text-muted-foreground">
                        Collect proof of similar properties in lower bands, property valuations, and any relevant documentation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Submit Your Challenge</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact the Valuation Office Agency (VOA) or use a professional service to submit your appeal
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Challenge Services</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="default" size="lg" className="w-full h-auto py-4 flex-col gap-1">
                      <span className="font-bold">DIY Guide</span>
                      <span className="text-xs opacity-90">Free step-by-step instructions</span>
                    </Button>
                    <Button variant="default" size="lg" className="w-full h-auto py-4 flex-col gap-1">
                      <span className="font-bold">Professional Service</span>
                      <span className="text-xs opacity-90">No win, no fee options</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleDownloadCSV} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" weight="bold" />
                    Download Report (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Data sources: {data.metadata.dataSource}</span>
                <span>•</span>
                <span>Updated: {data.metadata.lastUpdated}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ⭐ {data.averageRating} average rating • {data.ratingCount.toLocaleString()} reviews • {data.usageCount.toLocaleString()} people used this tool
              </div>
            </div>
          </>
        )}

        {!data && !loading && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Calculator className="w-8 h-8 text-muted-foreground" weight="duotone" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Check Your Council Tax?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter your postcode above to see if you could be saving money on your council tax
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
