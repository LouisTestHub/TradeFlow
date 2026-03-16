"use client"

import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

function DataCard({ title, value, source }: { title: string; value: string; source?: string }) {
  return (
    <div className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {source && <div className="text-xs text-gray-400 mt-2">📎 {source}</div>}
    </div>
  )
}

export default function MarketResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm text-blue-200 mb-6">
            🔬 Industry Research Report
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            UK Field Service & Trades<br />
            <span className="text-[#FF6F00]">Market Intelligence</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            Comprehensive research into the UK plumbing, electrical, and HVAC sectors — market size, 
            compliance landscape, digital transformation, and growth opportunities. Updated March 2026.
          </p>
        </div>
      </section>

      {/* Market Size */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">🔧 UK Trade & Field Service Market</h2>
          <p className="text-gray-600 mb-10 max-w-3xl">The UK field service management market is one of the fastest-growing SaaS sectors in Europe.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DataCard title="UK FSM Market (2024)" value="$232.2M" source="Market Data Forecast" />
            <DataCard title="Projected (2034)" value="$1.06B" source="Market Research Future" />
            <DataCard title="CAGR" value="16.4%" source="2025–2034" />
            <DataCard title="UK Share of Europe" value="15.8%" source="European FSM Market" />
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Market Growth Drivers</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  "Facilities management sector holds 33.8% of European FSM market",
                  "Pre-configured workflows making FSM accessible to SMEs",
                  "Mobile-first approach matching how trades actually work",
                  "Integration with accounting tools (Xero, QuickBooks, Sage)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#1565C0] mt-0.5">▸</span> {item}
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {[
                  "Regulatory pressure driving digital compliance",
                  "Customer expectations for digital communication",
                  "Labour shortages making scheduling efficiency critical",
                  "Growing awareness of SaaS benefits among tradespeople",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#1565C0] mt-0.5">▸</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Number of Businesses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">🏢 Number of UK Trade Businesses</h2>
          <p className="text-gray-600 mb-10 max-w-3xl">The UK has over 143,000 registered plumbing, electrical, and HVAC businesses — and growing.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 text-center">
              <div className="text-4xl mb-2">🔧</div>
              <div className="text-3xl font-bold text-[#1565C0]">44,630</div>
              <div className="text-sm text-gray-600 mt-1">Plumbing & Heating Businesses</div>
              <div className="text-xs text-green-600 mt-2">+2.9% YoY growth (2024)</div>
              <div className="text-xs text-gray-400">~150,000 plumbers total</div>
            </div>
            <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6 text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-[#FF6F00]">48,993</div>
              <div className="text-sm text-gray-600 mt-1">Electrical Businesses</div>
              <div className="text-xs text-green-600 mt-2">+2.3% YoY growth (2024)</div>
              <div className="text-xs text-gray-400">~230,000 electricians total</div>
            </div>
            <div className="bg-green-50 rounded-2xl border border-green-200 p-6 text-center">
              <div className="text-4xl mb-2">❄️</div>
              <div className="text-3xl font-bold text-green-700">2,299+</div>
              <div className="text-sm text-gray-600 mt-1">HVAC Contractors</div>
              <div className="text-xs text-green-600 mt-2">+4.9% growth since 2023</div>
              <div className="text-xs text-gray-400">HVAC market: $5.7B (2023)</div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">💡 The Untapped Digital Market</h3>
            <p className="text-sm text-gray-700 mb-4">
              With over 143,000 registered businesses and 380,000+ individual tradespeople, even modest digital 
              adoption rates represent a massive market opportunity. Most of these businesses still rely on paper 
              systems, manual scheduling, and phone-based coordination.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#1565C0]">45,703</div>
                <div className="text-xs text-gray-500">Plumbing firms projected (2025)</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#1565C0]">49,885</div>
                <div className="text-xs text-gray-500">Electrical firms projected (2025)</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#1565C0]">$11.6B</div>
                <div className="text-xs text-gray-500">HVAC market projected (2033)</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#1565C0]">380K+</div>
                <div className="text-xs text-gray-500">Total UK tradespeople</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Landscape */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">⚖️ Compliance Landscape</h2>
          <p className="text-gray-600 mb-10 max-w-3xl">UK trades operate under some of the most rigorous compliance frameworks in the world.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Gas Safe Register",
                badge: "Legally Mandated",
                items: [
                  "Official registration body for all gas businesses and engineers",
                  "It is a criminal offence to carry out gas work without registration",
                  "Annual landlord gas safety checks (CP12) required",
                  "Records must be maintained and provided to tenants",
                  "Regular competence assessments",
                  "All work must comply with Gas Safety Regulations 1998",
                ],
              },
              {
                title: "NICEIC",
                badge: "Voluntary but Essential",
                items: [
                  "Leading certification body for electrical contracting",
                  "Registered electricians can self-certify Part P notifiable work",
                  "Regular assessment of competence and safety standards",
                  "Essential for winning commercial and public sector contracts",
                  "Compliance with BS 7671 (IET Wiring Regulations)",
                  "Building Regulations Part P compliance for domestic work",
                ],
              },
              {
                title: "F-Gas Regulation",
                badge: "EU-Retained Law",
                items: [
                  "Certification required for handling fluorinated greenhouse gases",
                  "Mandatory leak checks on equipment above threshold",
                  "Detailed record-keeping for all gas handling activities",
                  "Phasedown schedule reducing HFC supply",
                  "Annual reporting requirements for larger quantities",
                  "Penalties include fines and loss of certification",
                ],
              },
              {
                title: "CIS (Construction Industry Scheme)",
                badge: "HMRC Mandatory",
                items: [
                  "Applies to trades working as subcontractors in construction",
                  "Monthly CIS returns required from contractors",
                  "Subcontractor verification before payment",
                  "Tax deductions: 20% (registered) or 30% (unregistered)",
                  "Late filing penalties: £100–£3,000+",
                  "Many tradespeople unaware they fall under CIS",
                ],
              },
            ].map((reg) => (
              <div key={reg.title} className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">{reg.title}</h3>
                  <span className="text-xs bg-blue-100 text-[#1565C0] px-2 py-1 rounded-full">{reg.badge}</span>
                </div>
                <ul className="space-y-2">
                  {reg.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#1565C0] mt-0.5">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Transformation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">📱 Digital Transformation in Trades</h2>
          <p className="text-gray-600 mb-10 max-w-3xl">The trades sector is undergoing rapid digital transformation — driven by customer expectations, compliance needs, and efficiency gains.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Customer Expectations",
                desc: "Homeowners expect online booking, digital quotes, electronic invoices, and real-time ETAs. Trades that don't offer this lose work to those that do.",
                trend: "High demand",
              },
              {
                title: "Mobile-First Working",
                desc: "Tradespeople spend 80%+ of their time on site, not in an office. Software must work on mobile, offline, and in poor connectivity areas.",
                trend: "Essential",
              },
              {
                title: "Cashless Payments",
                desc: "More customers want to pay by card or bank transfer. Trade businesses need integrated payment processing to avoid losing revenue.",
                trend: "Accelerating",
              },
              {
                title: "AI & Automation",
                desc: "AI-powered scheduling, automated invoice reminders, and smart quoting are emerging. Early adopters see significant efficiency gains.",
                trend: "Emerging",
              },
              {
                title: "Integration Economy",
                desc: "Trades need their job management to sync with accounting (Xero/QuickBooks), suppliers, and compliance bodies. Islands of data are a problem.",
                trend: "Growing",
              },
              {
                title: "Review Economy",
                desc: "Google reviews, Checkatrade, Trustpilot — online reputation drives work. Automated review collection is becoming a competitive advantage.",
                trend: "Critical",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl border p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <span className="text-xs bg-blue-100 text-[#1565C0] px-2 py-1 rounded-full">{item.trend}</span>
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">🎯 Industry Pain Points & Solution Gaps</h2>
          <p className="text-gray-600 mb-10 max-w-3xl">Existing solutions either miss key features or aren&apos;t designed for how UK trades actually work.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-red-600">❌ What&apos;s Missing from Current Tools</h3>
              <ul className="space-y-3">
                {[
                  "No single platform handles Gas Safe, NICEIC, and F-Gas certificates",
                  "Most tools are US-built — no CIS support, no UK compliance",
                  "Pricing in USD confuses UK customers",
                  "Poor offline capability for areas with weak signal",
                  "No integrated route optimisation for multi-job days",
                  "Compliance certificate generation still paper-based",
                  "No landlord portal for managing property portfolios",
                  "Poor integration with UK-specific accounting tools",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-500 mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-green-600">✅ What TradeFlow Delivers</h3>
              <ul className="space-y-3">
                {[
                  "All compliance certificates in one platform — digital, searchable, shareable",
                  "UK-native: CIS, Gas Safe, NICEIC, F-Gas built in from day one",
                  "GBP pricing, UK support, UK data hosting",
                  "Offline-first mobile app with automatic sync",
                  "Map-based scheduling with route optimisation",
                  "Digital certificate generation with customer signatures",
                  "Landlord portal for gas safety certificate management",
                  "Two-way sync with Xero, QuickBooks, and Sage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">📚 Sources & References</h2>
          <div className="bg-gray-50 rounded-2xl border p-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              {[
                "Market Data Forecast — Europe Field Service Management Market",
                "Market Research Future — UK FSM Market Report",
                "IBISWorld — Plumbing, Heating & AC Installation UK",
                "IBISWorld — Electrical Businesses UK Industry Report",
                "Gas Safe Register — Official Statistics & Regulations",
                "NICEIC — Registration Requirements & Standards",
                "HMRC — Construction Industry Scheme Guidance",
                "Rentech Digital — HVAC Contractors UK Data",
                "IET — BS 7671 Wiring Regulations",
                "HSE — F-Gas Regulation Compliance Guide",
              ].map((source) => (
                <div key={source} className="flex items-start gap-2 py-1">
                  <span className="text-gray-400 mt-0.5">📎</span>
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#FF6F00] to-[#E65100]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See why TradeFlow is purpose-built for this market
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            UK compliance. Mobile-first. Affordable. Built for how trades actually work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#FF6F00] text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Start Your Free Trial →
            </Link>
            <Link href="/opportunity" className="inline-flex items-center justify-center px-8 py-3 border border-white text-white text-lg rounded-lg hover:bg-white/10 transition-colors">
              View Business Plan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
