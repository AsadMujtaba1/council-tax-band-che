# Planning Guide

A UK Council Tax Band Checker that empowers homeowners to understand if they're overpaying on council tax and provides clear pathways to challenge their band and save money.

**Experience Qualities**: 
1. **Empowering** - Users gain clarity and control over potentially hidden savings, feeling informed and ready to take action.
2. **Trustworthy** - Government data sources and transparent calculations build confidence in the tool's accuracy and recommendations.
3. **Actionable** - Clear next steps and specific savings estimates drive immediate action rather than passive information consumption.

**Complexity Level**: Light Application (multiple features with basic state)
This tool processes user inputs (postcode, property details), compares against data sets, calculates savings, and presents multiple views (comparison tables, historical trends, CTAs), but doesn't require complex multi-view navigation or advanced state management.

## Essential Features

**Postcode Validation & Lookup**
- Functionality: Validates UK postcode format and retrieves location metadata
- Purpose: Ensures accurate data matching and provides geographic context for tax band comparison
- Trigger: User enters postcode in input field
- Progression: Input postcode → Validate format → Fetch location data → Display region and local authority → Enable calculation
- Success criteria: Valid postcodes return accurate geographic data; invalid postcodes show clear error messages

**Council Tax Band Comparison**
- Functionality: Compares user's current band cost against area averages and adjacent bands
- Purpose: Reveals potential overpayment and quantifies savings opportunity
- Trigger: User submits form with postcode and optional property details
- Progression: Submit form → Fetch band data → Calculate differences → Display comparison table → Highlight savings → Show band breakdown
- Success criteria: Accurate calculations displayed in pounds sterling; clear visual hierarchy showing user's position vs. average

**Savings Estimation Calculator**
- Functionality: Calculates potential annual savings if user successfully challenges to lower band
- Purpose: Quantifies financial impact to motivate action
- Trigger: Automatic calculation upon data retrieval
- Progression: Retrieve user band → Compare to lower bands → Calculate annual difference → Display hero metric → Provide context
- Success criteria: Savings shown prominently with currency formatting; realistic estimates based on local authority rates

**Historical Trend Visualization**
- Functionality: Shows how council tax costs have changed over time using inflation data
- Purpose: Provides context for long-term savings and demonstrates value of challenging now
- Trigger: Displayed alongside current year comparison
- Progression: Load inflation data → Calculate adjusted historical costs → Display trend → Add context annotations
- Success criteria: Clear visual representation of cost increases; easy to understand trend direction

**Challenge Pathway CTAs**
- Functionality: Directs users to band challenge services and information resources
- Purpose: Converts insight into action and generates affiliate revenue
- Trigger: Displayed after results calculation
- Progression: View savings → See challenge options → Click affiliate link → External service journey
- Success criteria: Clear, prominent CTAs; multiple pathways (DIY guide, professional service); affiliate tracking

## Edge Case Handling

- **Invalid Postcode Format**: Display inline validation error with format example; prevent form submission.
- **Postcode Not Found**: Show friendly error suggesting double-check spelling; offer retry without data loss.
- **Missing Property Data**: Allow calculation with postcode only; use regional averages; note estimate may be less precise.
- **Extreme Cost Values**: Validate user-entered costs against band ranges; warn if value seems incorrect; allow override.
- **No Savings Opportunity**: Display positive message acknowledging correct banding; suggest other money-saving tools.
- **Partial API Data**: Show available information; mark estimates clearly; provide data source disclaimer.
- **Multiple Band Scenarios**: Show savings for each lower band option; explain challenge likelihood varies.

## Design Direction

The design should evoke financial clarity and empowerment - like finding money you didn't know you had. Think bold, confident typography that makes numbers pop, with a sophisticated color palette that balances trust (civic blues) with opportunity (vibrant accent). The experience should feel less like government bureaucracy and more like a smart financial advisor revealing insider knowledge.

## Color Selection

A sophisticated palette balancing governmental trustworthiness with financial opportunity, using strong contrast for data visibility and warm accents for positive savings messaging.

- **Primary Color**: Deep civic blue oklch(0.45 0.15 250) - Represents trust, governmental authority, and financial stability; used for main actions and headers
- **Secondary Colors**: 
  - Slate grey oklch(0.35 0.02 250) for secondary text and borders - Professional, readable, doesn't compete with data
  - Light cloud oklch(0.97 0.01 250) for cards and backgrounds - Clean, spacious, government-document clarity
- **Accent Color**: Vibrant teal oklch(0.65 0.15 190) - Attention-grabbing for savings numbers and CTAs; suggests financial growth and positive change
- **Foreground/Background Pairings**: 
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent Teal (oklch(0.65 0.15 190)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Background Light (oklch(0.97 0.01 250)): Dark slate text (oklch(0.25 0.02 250)) - Ratio 12.8:1 ✓
  - Success green (oklch(0.55 0.18 145)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection

Typography should convey authoritative financial data while remaining approachable - precision without stuffiness, using a geometric sans that feels both modern and civic.

- **Primary**: Space Grotesk - Bold geometric forms with financial-report precision, excellent for large numbers and data hierarchy
- **Secondary**: Inter - Clean, highly readable for body text and form inputs; pairs well with Space Grotesk's character

**Typographic Hierarchy**:
- H1 (Tool Title): Space Grotesk Bold/32px/tight (-0.02em) - Commands attention without being overwhelming
- Hero Metric (Savings Amount): Space Grotesk Bold/48px/tight - The number that matters most, impossible to miss
- H2 (Section Headers): Space Grotesk SemiBold/24px/normal - Clear content separation
- H3 (Card Titles): Space Grotesk Medium/18px/normal - Hierarchical but not shouty
- Body Text: Inter Regular/16px/relaxed (1.6) - Comfortable reading for explanations
- Small Text (Meta info): Inter Regular/14px/normal - Data sources, timestamps, disclaimers
- Button Text: Space Grotesk Medium/16px/wide (0.02em) - Confident, actionable
- Table Headers: Inter SemiBold/14px/wide (0.04em uppercase) - Traditional data table treatment
- Table Data: Inter Regular/15px/tabular-nums - Aligned numbers, easy scanning

## Animations

Animations should feel like revealing hidden information - subtle slides and fades that guide attention to key savings numbers and CTAs, with a slight elastic ease that suggests opportunity and flexibility.

Key moments: Form submission triggers a brief loading state with subtle pulse, results slide up with staggered reveal (hero metric first, then supporting details), savings comparisons animate width to show proportional differences, hover states on CTAs use slight lift and glow to suggest clickability. Keep timing brisk (200-300ms) to maintain momentum and avoid feeling bureaucratic.

## Component Selection

**Components**:
- **Card**: Primary container for results sections - using neutral variant with custom border colors for semantic grouping (success for savings, info for comparisons)
- **Input**: Text input for postcode with validation states - enhanced with inline error messaging and format hints
- **Select**: Dropdowns for property type and age - standard styling with clear labels
- **Button**: Primary actions (calculate, download, affiliate CTAs) - using primary variant with disabled states
- **Table**: Band comparison breakdown - custom implementation with sticky headers on mobile
- **Badge**: Trust signals (data sources, update timestamps) - using secondary variant with custom colors
- **Progress**: Visual comparison bars showing user vs. area average - custom width animations
- **Separator**: Visual breaks between result sections - using default gray

**Customizations**:
- Custom hero metric card with oversized typography and icon
- Gradient background patterns using CSS radial gradients for depth
- Custom progress bar component with labeled endpoints and percentage indicators
- Collapsible FAQ accordion (using Shadcn Accordion) with custom expand icons
- Custom table with alternating row colors and responsive column stacking

**States**:
- Buttons: Default → Hover (lift + brightness) → Active (pressed) → Disabled (opacity 40%, no cursor) → Loading (spinner + text change)
- Inputs: Default → Focus (ring + border color) → Error (red border + shake micro-animation) → Success (green border)
- Cards: Static with subtle shadow; hover on interactive cards adds border highlight

**Icon Selection**:
- Phosphor icons throughout for consistency
- MagnifyingGlass for search/lookup actions
- Calculator for calculation trigger
- TrendUp for savings and positive changes
- Info for tooltips and help text
- Download for export actions
- ArrowRight for CTAs and next steps
- CheckCircle for validation success
- WarningCircle for alerts

**Spacing**:
- Container padding: p-4 mobile, p-6 tablet+
- Section gaps: space-y-6 (24px) for major sections
- Card internal: p-6 standard, p-8 for hero metrics
- Form fields: mb-4 between fields, mb-6 before buttons
- Grid gaps: gap-4 (16px) for card grids
- Inline spacing: gap-2 for icon-text pairs, gap-3 for button groups

**Mobile**:
- Single column layout throughout (grid-cols-1)
- Form inputs full width with 48px min-height for touch targets
- Tables switch to stacked card layout below 640px
- Hero metric scales down to 36px on mobile
- Sticky bottom CTA bar on mobile for constant visibility
- Hamburger-stacked comparison cards instead of side-by-side
- Font sizes scale down 10-15% on mobile for readability
