"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface PostTemplate {
  id: string
  title: string
  description: string
  content: string
  industry: string[]
}

const templates: PostTemplate[] = [
  {
    id: "personal-insight",
    title: "Personal Insight",
    description: "Share a valuable lesson from your professional experience",
    industry: ["all"],
    content: `I learned something valuable this week that I want to share with you all.

When we approach challenges with curiosity instead of frustration, we unlock creative solutions we might otherwise miss.

A client project hit a major roadblock yesterday. Instead of pushing harder against it, we took a step back and asked "what if this obstacle is actually pointing us toward a better direction?"

That simple reframing led to an approach that was not only more efficient but actually delivered better results than our original plan.

What recent challenge have you reframed that led to unexpected positive outcomes?

#ProfessionalGrowth #LeadershipLessons #PerspectiveShift`,
  },
  {
    id: "industry-trend",
    title: "Industry Trend Analysis",
    description: "Analyze an emerging trend in your field",
    industry: ["technology", "finance", "healthcare", "marketing"],
    content: `Three industry trends I'm watching closely this quarter:

1️⃣ [Trend One]: We're seeing unprecedented adoption across sectors, particularly in [specific example]. Organizations that leverage this are reporting [specific outcome].

2️⃣ [Trend Two]: This shift is fundamentally changing how we approach [specific process]. Early adopters are already [specific benefit].

3️⃣ [Trend Three]: Perhaps most exciting is how this is democratizing access to [specific resource or capability].

Which of these trends is most relevant to your work, and how are you responding?

#IndustryInsights #FutureOfWork #[IndustrySpecificHashtag]`,
  },
  {
    id: "contrarian-view",
    title: "Contrarian Viewpoint",
    description: "Challenge conventional wisdom with a thoughtful counterpoint",
    industry: ["consulting", "hr", "education", "legal"],
    content: `Unpopular opinion: [Common industry practice] might be holding us back more than moving us forward.

Here's why:

• It optimizes for [short-term metric] at the expense of [important long-term outcome]
• It assumes [assumption] which our data suggests isn't always true
• It overlooks the critical importance of [overlooked factor]

I've found that organizations that instead focus on [alternative approach] consistently outperform peers on [meaningful metrics] over time.

What industry "best practice" do you think deserves more scrutiny?

#RethinkingStandards #IndustryInnovation #ThoughtLeadership`,
  },
]

export function PostTemplates({ onSelectTemplate }: { onSelectTemplate: (content: string) => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle>{template.title}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-4">{template.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => onSelectTemplate(template.content)}>
              Use Template
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(template.id, template.content)}>
              {copiedId === template.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
