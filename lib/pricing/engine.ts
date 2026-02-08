import { prisma } from "@/lib/prisma";

type PricingContext = {
  serviceId: string;
  location?: string;
  hours?: number;
  sessions?: number;
  isDiaspora?: boolean;
  promoCode?: string;
  isFirstConsultation?: boolean; // Add this parameter
};

export async function calculateServicePrice({
  serviceId,
  location,
  hours,
  sessions,
  isDiaspora,
  isFirstConsultation = false, // Add this parameter
}: {
  serviceId: string;
  location?: string;
  hours?: number;
  sessions?: number;
  isDiaspora?: boolean;
  isFirstConsultation?: boolean;
}) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { pricingRules: true },
  });

  if (!service) throw new Error("Service not found");

  if (service.pricingType === "QUOTE_BASED") {
    return {
      price: null,
      currency: service.currency,
      isQuoteRequired: true,
      breakdown: [],
    };
  }

  let base = service.basePrice || 0;
  let breakdown: any[] = [
    { label: "Base price", amount: base },
  ];

  // Apply free first consultation
  if (isFirstConsultation) {
    return {
      price: 0,
      currency: service.currency,
      isQuoteRequired: false,
      isFirstConsultation: true,
    };
  }

  // Apply pricing type logic
  if (service.pricingType === "HOURLY" && hours) {
    base = base * hours;
    breakdown.push({
      label: `Hourly rate x ${hours} hours`,
      amount: base,
    });
  }

  if (service.pricingType === "PER_SESSION" && sessions) {
    base = base * sessions;
    breakdown.push({
      label: `Per-session rate x ${sessions} sessions`,
      amount: base,
    });
  }

  let finalPrice = base;

  // Apply pricing rules
  for (const rule of service.pricingRules) {
    if (!rule.isActive) continue;

    const condition = rule.condition as any;
    let applies = true;

    if (condition.location && condition.location !== location) {
      applies = false;
    }

    if (condition.isDiaspora !== undefined && condition.isDiaspora !== isDiaspora) {
      applies = false;
    }

    if (condition.hours?.gte && hours < condition.hours.gte) {
      applies = false;
    }

    if (!applies) continue;

    if (rule.modifierType === "ADD") {
      finalPrice += rule.priceModifier;
      breakdown.push({
        label: rule.name,
        amount: rule.priceModifier,
      });
    }

    if (rule.modifierType === "SUBTRACT") {
      finalPrice -= rule.priceModifier;
      breakdown.push({
        label: rule.name,
        amount: -rule.priceModifier,
      });
    }

    if (rule.modifierType === "MULTIPLY") {
      const delta = finalPrice * (rule.priceModifier - 1);
      finalPrice = finalPrice * rule.priceModifier;
      breakdown.push({
        label: rule.name,
        amount: delta,
      });
    }
  }

  return {
    price: Math.max(finalPrice, 0),
    currency: service.currency,
    isQuoteRequired: false,
    breakdown,
  };
}
