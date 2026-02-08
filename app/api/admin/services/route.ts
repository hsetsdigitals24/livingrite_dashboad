import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
// GET: Fetch all services or single service
// ============================================================================

export async function GET(
  req: NextRequest,
  { params }: { params?: { serviceId?: string } } = {}
) {
  try {
    // If serviceId is provided, fetch single service
    if (params?.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: params.serviceId },
      });

      if (!service) {
        return NextResponse.json(
          {
            error: 'Service not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(service);
    }

    // Fetch all services
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

// ============================================================================
// PATCH: Update service
// ============================================================================

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const body = await req.json();

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          error: 'Service not found',
        },
        { status: 404 }
      );
    }

    const {
      basePrice,
      pricingConfig,
      title,
      slug,
      description,
      isActive,
    } = body;

    const updateData: any = {};

    // Update basic fields if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              title: 'Title must be a non-empty string',
            },
          },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== 'string' || !slug.trim()) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              slug: 'Slug must be a non-empty string',
            },
          },
          { status: 400 }
        );
      }

      // Check if new slug already exists (and is different from current)
      if (slug !== existingService.slug) {
        const slugExists = await prisma.service.findUnique({
          where: { slug: slug.trim() },
        });

        if (slugExists) {
          return NextResponse.json(
            {
              error: 'Service with this slug already exists',
            },
            { status: 409 }
          );
        }
      }

      updateData.slug = slug.trim();
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Update price
    if (basePrice !== undefined) {
      if (typeof basePrice !== 'number' || basePrice < 0) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              basePrice: 'Base price must be a non-negative number',
            },
          },
          { status: 400 }
        );
      }
      updateData.basePrice = basePrice;
    }

    // Update pricing config - merge with existing
    if (pricingConfig) {
      // Validate pricing config
      if (
        pricingConfig.discountPercentage !== undefined &&
        (typeof pricingConfig.discountPercentage !== 'number' ||
          pricingConfig.discountPercentage < 0 ||
          pricingConfig.discountPercentage > 100)
      ) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              discountPercentage:
                'Discount percentage must be between 0 and 100',
            },
          },
          { status: 400 }
        );
      }

      if (
        pricingConfig.minPrice !== undefined &&
        (typeof pricingConfig.minPrice !== 'number' ||
          pricingConfig.minPrice < 0)
      ) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              minPrice: 'Minimum price must be a non-negative number',
            },
          },
          { status: 400 }
        );
      }

      if (
        pricingConfig.maxPrice !== undefined &&
        (typeof pricingConfig.maxPrice !== 'number' ||
          pricingConfig.maxPrice < 0)
      ) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: {
              maxPrice: 'Maximum price must be a non-negative number',
            },
          },
          { status: 400 }
        );
      }

      // Merge with existing pricingConfig
      const existingConfig = (existingService.pricingConfig as any) || {};
      updateData.pricingConfig = {
        ...existingConfig,
        ...pricingConfig,
      };
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: updateData,
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        error: 'Failed to update service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// DELETE: Delete service
// ============================================================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          error: 'Service not found',
        },
        { status: 404 }
      );
    }

    // Delete the service
    const deletedService = await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json({
      message: 'Service deleted successfully',
      deletedService,
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete service',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}