"use client"

import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

function StatCard({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:border-[#1565C0]/30">
      <div className="text-3xl mb-3">{emoji}</div>
      <div className="text-3xl font-bold text-[#1565C0] mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

export default function OpportunityPage() {
  const competitors = [
    { name: "ServiceM8", pricing: "£25–269/mo", strengths: "Job-based pricing, unlimited users", weaknesses: "No UK compliance features", target: "General trades" },
    { name: "Jobber", pricing: "$39–149/mo", strengths: "AI tools, client portal", weaknesses: "US pricing, limited UK features", target: "North American trades" },
    { name: "Tradify", pricing: "£34–44/user/mo", strengths: "Simple job management", weaknesses: "No compliance certificates", target: "Small teams" },
    { name: "Fergus", pricing: "£39–45/mo", strengths: "Built by a plumber, practical", weaknesses: "Limited UK compliance", target: "Plumbing/HVAC" },
    { name: "BigChange", pricing: "£15–100/user/mo", strengths: "Fleet tracking included", weaknesses: "Complex, steep learning curve", target: "Larger fleets" },
    { name: "Commusoft", pricing: "£59+/mo", strengths: "Good for HVAC, asset mgmt", weaknesses: "Expensive for small teams", target: "HVAC specialists" },
    { name: "Powered Now", pricing: "£15–37/mo", strengths: "Affordable, gas/electrical certs", weaknesses: "Basic UI, limited reporting", target: "Solo traders" },
  ]

  const projections = [
    { customers: "500", mrr: "£17,500", arr: "£210,000" },
    { customers: "1,000", mrr: "£35,000", arr: "£420,000" },
    { customers: "5,000", mrr: "£175,000", arr: "£2,100,000" },
    { customers: "10,000", mrr: "£350,000", arr: "£4,200,000" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm text-blue-200 mb-6">
            📊 Business Plan & Market Opportunity
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            143,000+ UK Trade Businesses.<br />
            <span className="text-[#FF6F00]">One Platform to Run Them All.</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Plumbers, electricians, and HVAC engineers are the backbone of UK infrastructure. 
            Most still run their businesses from a van with a phone and a notebook. TradeFlow changes that.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 bg-[#FF6F00] text-white text-lg font-semibold rounded-lg hover:bg-[#E65100] transition-colors">
              Start Your Free Trial →
            </Link>
            <Link href="/market" className="inline-flex items-center justify-center px-8 py-3 border border-white/30 text-white text-lg rounded-lg hover:bg-white/10 transition-colors">
              View Market Research
            </Link>
          </div>
        </div>
      </section>

      {/* Market Size */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Market Size</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            The UK field service management market is exploding — and trades are at the centre of it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="$232M" label="UK FSM Market (2024)" emoji="📈" />
            <StatCard value="$1.06B" label="Projected Market (2034)" emoji="🚀" />
            <StatCard value="16.4%" label="Market CAGR" emoji="📊" />
            <StatCard value="143K+" label="Plumbing, Electrical & HVAC Firms" emoji="🔧" />
          </div>
          <div className="mt-12 bg-white rounded-2xl border p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">TAM → SAM → SOM</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-blue-50">
                <div className="text-sm font-semibold text-[#1565C0] mb-2">Total Addressable Market</div>
                <div className="text-4xl font-bold text-slate-900">£860M</div>
                <div className="text-sm text-gray-600 mt-2">FSM software spend across all UK field service businesses</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-orange-50">
                <div className="text-sm font-semibold text-[#FF6F00] mb-2">Serviceable Addressable Market</div>
                <div className="text-4xl font-bold text-slate-900">£215M</div>
                <div className="text-sm text-gray-600 mt-2">Plumbing, electrical & HVAC businesses seeking digital job management</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-green-50">
                <div className="text-sm font-semibold text-green-600 mb-2">Serviceable Obtainable Market</div>
                <div className="text-4xl font-bold text-slate-900">£10.8M</div>
                <div className="text-sm text-gray-600 mt-2">5% capture within 5 years — 5,000 paying trade businesses</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">The Problem</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Most trades run their entire operation from memory, WhatsApp, and paper invoices.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "📋", title: "No Job Tracking", desc: "Jobs tracked on paper or in the tradesperson's head. No visibility on status, costs, or timelines. Jobs fall through the cracks." },
              { emoji: "📱", title: "WhatsApp Chaos", desc: "Customer comms, quotes, photos, and schedules all mixed into WhatsApp threads. Nothing is searchable or organised." },
              { emoji: "💷", title: "Late Invoicing", desc: "Average UK tradesperson waits 2–3 weeks to invoice after a job. Many forget entirely. Cash flow suffers." },
              { emoji: "📜", title: "Compliance Paperwork", desc: "Gas Safe certificates, NICEIC reports, F-Gas logs — all done on paper. Lost certificates mean failed audits and lost work." },
              { emoji: "🚗", title: "Schedule Mayhem", desc: "No central scheduling system. Double-bookings, missed appointments, and wasted travel time are the norm." },
              { emoji: "📊", title: "Zero Business Data", desc: "Most tradespeople have no idea which jobs are profitable. No reporting, no margins, no data to make decisions." },
            ].map((p) => (
              <div key={p.title} className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Drivers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Regulatory Drivers</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            UK trade businesses operate under significant compliance requirements that demand digital solutions.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Gas Safe Register", desc: "Legally mandated registration for all gas engineers. Annual safety checks required for landlords. Detailed records of all gas work must be maintained. Non-compliance is a criminal offence." },
              { title: "NICEIC Certification", desc: "Leading electrical certification body. Registered electricians can self-certify Part P notifiable work. Regular assessments ensure competence and safety standards. Essential for winning commercial contracts." },
              { title: "F-Gas Regulation", desc: "All HVAC engineers working with fluorinated gases must hold F-Gas certification. Strict record-keeping requirements for gas handling. Leak checks and reporting mandatory. Penalties for non-compliance." },
              { title: "CIS — Construction Industry Scheme", desc: "Any tradesperson working as a subcontractor on construction projects falls under CIS. Monthly returns, tax deductions, and verification required. Most trades don't realise they need to comply." },
            ].map((reg) => (
              <div key={reg.title} className="bg-white rounded-2xl border p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#1565C0] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">⚖️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{reg.title}</h3>
                    <p className="text-sm text-gray-600">{reg.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Customer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Target Customer</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4">🔧 Primary: UK Trade Businesses</h3>
                  <ul className="space-y-3">
                    {[
                      "Solo traders to teams of 1–15",
                      "Plumbers, electricians, HVAC engineers",
                      "Gas Safe / NICEIC / F-Gas registered",
                      "Managing 5–50+ jobs per week",
                      "Currently using paper, WhatsApp, or basic tools",
                      "Need compliance certificates and reporting",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-[#1565C0]">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4">📊 Market Numbers</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#1565C0]">44,630</div>
                      <div className="text-sm text-gray-600">Plumbing & heating businesses</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#1565C0]">48,993</div>
                      <div className="text-sm text-gray-600">Electrical businesses</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#1565C0]">~150K</div>
                      <div className="text-sm text-gray-600">Total plumbers in the UK</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#1565C0]">~230K</div>
                      <div className="text-sm text-gray-600">Total electricians in the UK</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Landscape */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Competitive Landscape</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Fragmented market with no clear UK winner for trades. Most tools are US-built or too generic.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border overflow-hidden">
              <thead>
                <tr className="bg-[#0D47A1] text-white">
                  <th className="text-left p-4 text-sm font-semibold">Competitor</th>
                  <th className="text-left p-4 text-sm font-semibold">Pricing</th>
                  <th className="text-left p-4 text-sm font-semibold">Strengths</th>
                  <th className="text-left p-4 text-sm font-semibold">Weaknesses</th>
                  <th className="text-left p-4 text-sm font-semibold">Target</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 font-medium text-sm">{c.name}</td>
                    <td className="p-4 text-sm text-gray-600">{c.pricing}</td>
                    <td className="p-4 text-sm text-green-600">{c.strengths}</td>
                    <td className="p-4 text-sm text-red-500">{c.weaknesses}</td>
                    <td className="p-4 text-sm text-gray-600">{c.target}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 border-t-2 border-[#1565C0]">
                  <td className="p-4 font-bold text-sm text-[#1565C0]">TradeFlow ✦</td>
                  <td className="p-4 text-sm font-medium">£29–49/user/mo</td>
                  <td className="p-4 text-sm text-green-600">UK compliance built-in, Gas Safe/NICEIC certs</td>
                  <td className="p-4 text-sm text-gray-400">New entrant, building brand</td>
                  <td className="p-4 text-sm font-medium">UK plumbers, sparkies, HVAC</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why TradeFlow */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Why TradeFlow Wins</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🇬🇧", title: "Built for UK Trades", desc: "Gas Safe, NICEIC, F-Gas, and CIS compliance built in from day one. Not a US tool with a UK flag." },
              { emoji: "📜", title: "Digital Certificates", desc: "Generate compliance certificates on your phone. No more carbon copy booklets or lost paperwork." },
              { emoji: "💷", title: "Affordable", desc: "Starting at £29/user/month. No enterprise pricing, no lock-in. Cancel anytime." },
              { emoji: "📱", title: "Van-Ready Mobile App", desc: "Designed for the field. Works offline, syncs when you're back in signal. Photo capture, time tracking, GPS." },
              { emoji: "⚡", title: "Quote-to-Invoice in Minutes", desc: "Create a quote on site, convert to job, invoice on completion. No admin backlog." },
              { emoji: "🗺️", title: "Smart Scheduling & Routing", desc: "Map-based scheduling with route optimisation. Reduce drive time, fit more jobs in." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-[#1565C0]/30 transition-colors">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-16 bg-gradient-to-br from-[#0D47A1] to-[#1565C0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Revenue Projections</h2>
          <p className="text-center text-blue-100 mb-12 max-w-2xl mx-auto">
            Based on average revenue of £35/user/month across blended plans.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projections.map((p) => (
              <div key={p.customers} className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6 text-center">
                <div className="text-sm text-[#FF6F00] font-medium mb-1">{p.customers} Customers</div>
                <div className="text-3xl font-bold text-white mb-2">{p.arr}</div>
                <div className="text-sm text-blue-200">ARR ({p.mrr} MRR)</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Go-to-Market */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Go-to-Market Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { emoji: "🎯", title: "Product-Led Growth", desc: "Free trial with self-serve onboarding. Tradespeople sign up, see value in 15 minutes, upgrade naturally." },
              { emoji: "🔍", title: "SEO & Content Marketing", desc: "Target 'plumber invoicing software', 'Gas Safe certificate app', 'electrician job management'. Answer the questions trades are Googling." },
              { emoji: "🤝", title: "Trade Association Partnerships", desc: "Partner with Gas Safe Register, NICEIC, Electrical Contractors Association. Co-branded content and referral programmes." },
              { emoji: "💬", title: "Word of Mouth", desc: "Trades talk to each other. Referral programme with free months for both referrer and new customer. The best growth channel." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="text-3xl flex-shrink-0">{item.emoji}</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#FF6F00] to-[#E65100]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to run your trade business properly?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of UK tradespeople who&apos;ve upgraded from paper and WhatsApp.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#FF6F00] text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Start Your Free Trial →
          </Link>
          <p className="text-sm text-orange-200 mt-4">No credit card required • Free 14-day trial • Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
