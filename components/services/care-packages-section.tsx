'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  role: string;
}

interface Tier {
  name: string;
  isPremium?: boolean;
  team: TeamMember[];
}

interface CareCategory {
  id: string;
  name: string;
  tiers: Tier[];
}

const careData: CareCategory[] = [
  {
    id: 'neuro',
    name: 'Neurorehabilitation Care',
    tiers: [
      {
        name: 'Platinum Tier',
        isPremium: true,
        team: [
          { role: 'Neurocritical care physician' },
          { role: 'Specialist or registered nurses' },
          { role: 'Physiotherapist' },
          { role: 'Speech therapist' },
          { role: 'Nutritionist' },
          { role: 'Nursing assistants' },
        ],
      },
      {
        name: 'Diamond Tier',
        isPremium: true,
        team: [
          { role: 'Neurocritical care physician' },
          { role: 'Registered nurses' },
          { role: 'Physiotherapist' },
          { role: 'Nursing assistants' },
        ],
      },
      {
        name: 'Gold Tier',
        team: [
          { role: 'Medical doctor' },
          { role: 'Registered nurses' },
          { role: 'Physiotherapist' },
        ],
      },
    ],
  },
  {
    id: 'geriatric',
    name: 'Geriatric Care',
    tiers: [
      {
        name: 'Standard Tier',
        team: [
          { role: 'Medical doctor' },
          { role: 'Registered nurse or trained non-medical caregiver, depending on medical needs' },
        ],
      },
    ],
  },
  {
    id: 'post-surgical',
    name: 'Post-Surgical Care',
    tiers: [
      {
        name: 'Standard Tier',
        team: [
          { role: 'Medical doctor' },
          { role: 'Registered nurse' },
          { role: 'Physiotherapist' },
          { role: 'Nutritionist or trained caregiver, depending on surgical complexity' },
        ],
      },
    ],
  },
  {
    id: 'end-of-life',
    name: 'End-of-Life and Palliative Care',
    tiers: [
      {
        name: 'Specialized Tier',
        team: [
          { role: 'Critical care doctor or pain management specialist' },
          { role: 'Nurses' },
          { role: 'Nursing assistants' },
        ],
      },
    ],
  },
];

export function CarePackagesSection() {
  const [activeCategory, setActiveCategory] = useState('neuro');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Care Packages and Service Tiers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We offer flexible care structures, including 24-hour live-in care, tailored to each patient's medical needs.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 mb-8">
            {careData.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="py-3 text-sm md:text-base"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {careData.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tiers.map((tier, index) => (
                  <Card
                    key={index}
                    className={cn(
                      'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
                      tier.isPremium && 'lg:col-span-1 ring-2 ring-accent shadow-lg'
                    )}
                  >
                    {/* Premium Badge */}
                    {tier.isPremium && (
                      <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 text-xs font-semibold">
                        Premium
                      </div>
                    )}

                    <CardHeader className={tier.isPremium ? 'pt-10 pb-4' : ''}>
                      <CardTitle className="font-poppins text-xl md:text-2xl">
                        {tier.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2">
                        Comprehensive care team specialization
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {tier.team.map((member, memberIndex) => (
                          <div
                            key={memberIndex}
                            className="flex items-start gap-3 group"
                          >
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                            <p className="text-sm text-foreground leading-relaxed">
                              {member.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Info */}
        <div className="mt-12 p-6 md:p-8 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="font-poppins text-lg font-semibold mb-3">
            ✓ Available Care Options
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground/90">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              24-hour live-in care available
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Tailored to individual medical needs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Flexible tier selection and upgrades
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Professional care team coordination
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
