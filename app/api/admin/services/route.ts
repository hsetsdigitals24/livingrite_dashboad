import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// ============================================================================
// VALIDATION & HELPER FUNCTIONS
// ============================================================================

function validateServiceInput(data: any) {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.title = 'Service title is required and must be a non-empty string';
  }

  // Slug validation
  if (!data.slug || typeof data.slug !== 'string' || !data.slug.trim()) {
    errors.slug = 'Service slug is required and must be a non-empty string';
  }

  // Base price validation
  if (data.basePrice === undefined || data.basePrice === null) {
    errors.basePrice = 'Base price is required';
  } else if (typeof data.basePrice !== 'number' || data.basePrice < 0) {
    errors.basePrice = 'Base price must be a non-negative number';
  }

  // Currency validation
  if (!data.currency || typeof data.currency !== 'string') {
    errors.currency = 'Currency is required and must be a string';
  }

  // Pricing config validations (if provided)
  if (data.pricingConfig) {
    const config = data.pricingConfig;

    if (
      config.discountPercentage !== undefined &&
      (typeof config.discountPercentage !== 'number' ||
        config.discountPercentage < 0 ||
        config.discountPercentage > 100)
    ) {
      errors.discountPercentage =
        'Discount percentage must be a number between 0 and 100';
    }

    if (
      config.minPrice !== undefined &&
      (typeof config.minPrice !== 'number' || config.minPrice < 0)
    ) {
      errors.minPrice = 'Minimum price must be a non-negative number';
    }

    if (
      config.maxPrice !== undefined &&
      (typeof config.maxPrice !== 'number' || config.maxPrice < 0)
    ) {
      errors.maxPrice = 'Maximum price must be a non-negative number';
    }

    // Check if min <= max
    if (
      config.minPrice !== undefined &&
      config.maxPrice !== undefined &&
      config.minPrice > 0 &&
      config.maxPrice > 0 &&
      config.minPrice > config.maxPrice
    ) {
      errors.minPriceMax =
        'Minimum price cannot be greater than maximum price';
    }
  }

  return errors;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// GET: Fetch all services
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch services',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// POST: Create new service
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const validationErrors = validateServiceInput(body);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      description,
      basePrice,
      currency,
      isActive = true,
      pricingConfig,
    } = body;

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingService) {
      return NextResponse.json(
        {
          error: 'Service with this slug already exists',
          details: {
            slug: `A service with slug "${slug}" already exists`,
          },
        },
        { status: 409 }
      );
    }

    // Prepare pricing config with defaults - store as JSON object
    const pricingConfigData = {
      discountPercentage: pricingConfig?.discountPercentage || 0,
      minPrice: pricingConfig?.minPrice || 0,
      maxPrice: pricingConfig?.maxPrice || 0,
      pricingNotes: pricingConfig?.pricingNotes || '',
      enableForPayments: pricingConfig?.enableForPayments !== false,
    };

    // Create new service
    const newService = await prisma.service.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        description: description ? description.trim() : null,
        basePrice,
        currency,
        isActive,
        // Store the entire pricingConfig object as JSON
        pricingConfig: pricingConfigData,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);

    // Handle Prisma unique constraint errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          {
            error: 'Service with this slug already exists',
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to create service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
