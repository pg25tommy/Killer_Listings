# Project: Killer Listings – Stigmatized Property Intelligence Platform
version: 0.2
owner: Tommy Minter
status: Concept → MVP Planning
last updated: 2025-11-21

## 0. Overview

Killer Listings is a **BC-first property intelligence platform** that surfaces violent or stigmatizing incident history tied to residential addresses. The app provides clear, modern, mobile-first UI for property search, history scoring, and incident timelines — blending real estate usability with a darkly witty brand identity.

Tone: clean, confident, slightly noir. Never tacky, never horror-show.

---

## 1. Purpose

Home buyers, sellers, agents, and investors deserve to know the **full story behind a property**. Killer Listings provides:

- Address-level history status
- Incident timelines and linked sources
- Map-based browsing of properties with known histories
- Data-backed insight presented in a simple, modern interface

MVP scope is **British Columbia**, starting with **Vancouver + Lower Mainland**.

Long term: full Canada → select US regions → global.

---

## 2. Product Vision

> "Your dream home shouldn't come with a nightmare backstory."

Killer Listings adds a **history layer** to real estate search.
Users can quickly see whether a property has:

- **Confirmed violent incidents**
- **Possible matches**
- **A clean history**

The brand is clever, but the product remains professional and grounded.

---

## 3. Core Users

### 3.1 Primary
**Cautious Home Buyers**
Wants reassurance before making the biggest purchase of their lives.

### 3.2 Real Estate Agents
Shows properties daily and needs to avoid surprises with clients.

### 3.3 Property Investors / Flippers
Interested in stigma-discount opportunities.

### 3.4 Curious Locals / True Crime Enthusiasts
Explores neighborhoods and incidents out of curiosity.

---

## 4. MVP Scope – BC First

### 4.1 Regional Coverage
MVP supports only the following cities/regions:

- Vancouver
- Burnaby
- New Westminster
- Richmond
- Surrey
- Delta
- Coquitlam / Tri-Cities
- North Vancouver
- West Vancouver
- Victoria (optional Phase 1.5)

### 4.2 Prototype Data Boundaries
- All property addresses must be located in BC
- All incidents must occur within BC
- If a user searches outside BC:
  - Show message:
    *"Killer Listings is currently available in British Columbia. More regions coming soon."*

BC-first launch simplifies geocoding, data ingestion, and UI testing.

---

## 5. MVP Feature Set

### 5.1 Address Search
- Search by: address, postal code, city
- Autocomplete
- Quick "History Badge" in results
- If address is outside BC → redirect with message

### 5.2 Property Detail Page
- Modern hero section
- Address, city, postal, lat/lng
- "History Score" badge:
  - Green: No incidents
  - Yellow: Possible match / unclear
  - Red: Confirmed violent incident
- Incident Timeline:
  - date
  - type
  - short summary
  - link to external source
- Map snippet
- Disclaimer section

### 5.3 Incident Timeline
- Chronological list of associated incidents
- Highlights the most severe incident
- Supports multiple incidents per property
- Card-style layout

### 5.4 Map View
- BC-only map viewport
- Property pins (clean)
- Incident pins (subtle red)
- Tap → preview card → full page
- Optional clustering

### 5.5 UI and UX
- Mobile-first design
- Swipe-friendly cards
- Minimalist noir palette
- Clean typography
- No gore, no splatter, nothing horror

### 5.6 Static Pages
- About
- Legal/Disclaimer
- Contact

### 5.7 Optional MVP Auth
If included:
- Email/password or magic link
- Users can bookmark properties

---

## 6. Future Roadmap

### 6.1 Post-MVP
- Saved Searches
- History Alerts ("Notify me if this address comes up for sale")
- Radius-based incident search
- Severity-weighted "Neighborhood Score"
- More detailed property data integration
- Real police data ingestion pipelines
- Agent accounts with disclosure PDFs

### 6.2 Expansion
- Phase 2: Full BC
- Phase 3: Alberta + Ontario
- Phase 4: Canada-wide
- Phase 5: U.S. (state-by-state)

---

## 7. Look & Feel (Design System)

### 7.1 Visual Language
- Noir-modern theme
- Charcoal → black backgrounds
- Deep grey-blue for surfaces
- Subtle crimson accent for severity
- Clean white for typography
- Neutral greys for UI chrome

### 7.2 UI Components
- Sticky top nav (wordmark, Search, Map, About)
- Large search bar on homepage
- Property cards:
  - address
  - price (if available)
  - history badge
  - CTA: "View History"
- Timeline cards:
  - date
  - description
  - source link
- Map pins:
  - neutral for clean listings
  - red for flagged listings

### 7.3 Microcopy Examples
- When clean:
  *"No history found. You're in the clear."*
- When yellow:
  *"Something came up. Take a closer look."*
- When red:
  *"Confirmed incident. Read before you proceed."*

---

## 8. Information Architecture

### 8.1 Page Structure

#### `/`
Home page
- Killer Listings logo
- Big search bar
- "How it works"
- Preview map

#### `/search`
- List + map split
- Filters: severity, date range, property type
- BC-only radius

#### `/property/[id]`
- Property hero
- History Score
- Incident Timeline
- Map snippet
- Disclaimer panel

#### `/about`
#### `/legal`
#### `/contact`

#### `/auth/login` (optional)
#### `/auth/register` (optional)

---

## 9. Tech Stack

### 9.1 Frontend
- **Next.js** (same major version as SoftBound)
- React + TypeScript
- Tailwind CSS
- Reusable UI component library
- Integration with Mapbox or Google Maps
- Modern client-side interactions

### 9.2 Backend
- Next.js API routes
- Prisma
- Postgres
- Service layer:
  - `incidentService.ts`
  - `propertyService.ts`
- Normalize all BC addresses via one geocoding provider

### 9.3 Database Schema (High-Level)

#### `Property`
- id
- address
- city
- province
- postalCode
- latitude
- longitude
- listingPrice (optional)
- status
- historyScore (enum: CLEAN, POSSIBLE, CONFIRMED)

#### `Incident`
- id
- propertyId (nullable)
- latitude
- longitude
- type
- date
- summary
- sourceUrl
- severity (1–5)

#### `User` (optional)
- id
- email
- passwordHash

#### `Favorite` (optional)
- id
- userId
- propertyId

---

## 10. Geocoding Requirements

### Must:
- Identify addresses only within BC
- Use Google Geocoding or Mapbox
- Normalize Canadian postal codes (A1A 1A1)

### Matching Logic:
1. Exact address match
2. Street number + name + postal code
3. Lat/lng proximity (<= 10 meters)
4. Condo unit handling via fuzzy matching

---

## 11. Data Sourcing (Prototype Reality)

MVP does **not** require full automated ingestion.

### Acceptable prototype sources:
- Manually curated BC incidents
- Public VPD releases
- RCMP BC summaries
- Local news incident reports
- Developer-uploaded mock listings
- Developer-maintained JSON seeds

### Expansion:
- Semi-automated scrapers
- NLP matching (far future)
- Court/legal indexing (carefully)

---

## 12. Deployment

- Vercel
- Environment variables:
  - DB URL
  - Geocoding API key
  - Map provider token
- Automatic builds on push

---

## 13. Non-Functional Requirements

- High mobile usability
- Strong contrast accessibility
- Minimal load times
- Simple fallback behavior if external APIs fail
- Clear BC-only boundary enforcement
- Clean logs and error handling
- Never expose internal tooling or assistant references

---

## 14. AI/Tools Usage Standard

- Tools may generate drafts or boilerplate
- No references to assistants or models may appear in:
  - Code
  - Comments
  - Files
  - Docs
  - Commits
  - UI copy

All copy and code must appear human-authored.

---

## 15. Out of Scope for MVP

- Live police feeds
- US data
- Crowd reports
- Mortgage calculators
- Agent CRM tools
- MLS direct integration
- Large-scale ingestion pipelines

---

## 16. Definition of Done (BC MVP)

A valid MVP is achieved when:

1. A user can search any BC address
2. The system resolves it and returns:
   - A normalized address
   - A history badge
   - A property detail page
3. Vancouver listings have:
   - Incident timelines
   - Linked sources
   - Severity badges
4. Map view displays BC pins
5. Searching outside BC is gracefully rejected
6. Mobile experience is smooth and intuitive
7. The brand identity reads clearly:
   **modern, noir, clean, professional**
8. Deployed publicly on Vercel

---
