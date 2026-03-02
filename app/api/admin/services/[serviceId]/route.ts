import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// DELETE: Delete a service by ID
// ============================================================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;

    // Validate serviceId
    if (!serviceId || typeof serviceId !== 'string' || !serviceId.trim()) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: {
            serviceId: 'Service ID is required and must be a non-empty string',
          },
        },
        { status: 400 }
      );
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId.trim() },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          error: 'Service not found',
          details: {
            message: `Service with ID "${serviceId}" does not exist`,
          },
        },
        { status: 404 }
      );
    }

    // Check if service has any active bookings
    const activeBookings = await prisma.booking.findMany({
      where: {
        serviceId: serviceId.trim(),
        status: { in: ['SCHEDULED', 'COMPLETED'] },
      },
    });

    if (activeBookings.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete service with active bookings',
          details: {
            message: `This service has ${activeBookings.length} active bookings. Please cancel or complete them first.`,
            activeBookingCount: activeBookings.length,
          },
        },
        { status: 409 }
      );
    }

    // Delete the service
    const deletedService = await prisma.service.delete({
      where: { id: serviceId.trim() },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Service deleted successfully',
        data: {
          id: deletedService.id,
          title: deletedService.title,
          slug: deletedService.slug,
          deletedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          {
            error: 'Constraint violation',
            details: {
              message: 'Cannot delete service due to database constraints',
            },
          },
          { status: 409 }
        );
      }

      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          {
            error: 'Service not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to delete service',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// PATCH: Update a single service
// ============================================================================

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;
    const body = await req.json();

    // Validate serviceId
    if (!serviceId || typeof serviceId !== 'string' || !serviceId.trim()) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: {
            serviceId: 'Service ID is required and must be a non-empty string',
          },
        },
        { status: 400 }
      );
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId.trim() },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          error: 'Service not found',
          details: {
            message: `Service with ID "${serviceId}" does not exist`,
          },
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.basePrice !== undefined) updateData.basePrice = body.basePrice;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.pricingConfig !== undefined) updateData.pricingConfig = body.pricingConfig;

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: serviceId.trim() },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Service updated successfully',
        data: updatedService,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating service:', error);

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          {
            error: 'Slug already exists',
            details: {
              message: 'A service with this slug already exists',
            },
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to update service',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Bulk operations (using PUT to avoid conflicts with PATCH)
// ============================================================================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  // This is a workaround for bulk delete using PATCH
  // Useful if you want to delete multiple services in one request
  try {
    const body = await req.json();
    const { serviceIds, action } = body;

    // Only handle bulk delete action
    if (action !== 'bulkDelete' || !Array.isArray(serviceIds)) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: {
            message: 'Expected action "bulkDelete" and serviceIds array',
          },
        },
        { status: 400 }
      );
    }

    if (serviceIds.length === 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: {
            message: 'At least one service ID is required',
          },
        },
        { status: 400 }
      );
    }

    // Validate all IDs
    const invalidIds = serviceIds.filter(
      (id: any) => !id || typeof id !== 'string' || !id.trim()
    );

    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: {
            message: 'All service IDs must be non-empty strings',
            invalidCount: invalidIds.length,
          },
        },
        { status: 400 }
      );
    }

    // Check for active bookings in any of the services
    const activeBookings = await prisma.booking.findMany({
      where: {
        serviceId: { in: serviceIds },
        status: { in: ['SCHEDULED', 'COMPLETED'] },
      },
      select: {
        id: true,
        serviceId: true,
      },
    });

    if (activeBookings.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete services with active bookings',
          details: {
            message: `${activeBookings.length} service(s) have active bookings`,
            affectedServices: [...new Set(activeBookings.map((b) => b.serviceId))],
          },
        },
        { status: 409 }
      );
    }

    // Delete all services
    const deleteResult = await prisma.service.deleteMany({
      where: {
        id: { in: serviceIds },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${deleteResult.count} service(s) deleted successfully`,
        data: {
          deletedCount: deleteResult.count,
          requestedCount: serviceIds.length,
          deletedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error bulk deleting services:', error);

    return NextResponse.json(
      {
        error: 'Failed to delete services',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
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

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ serviceId: string }> }
// ) {
//   try {
//     const { serviceId } = await params;
//     const body = await req.json();

//     // Check if service exists
//     const existingService = await prisma.service.findUnique({
//       where: { id: serviceId },
//     });

//     if (!existingService) {
//       return NextResponse.json(
//         {
//           error: 'Service not found',
//         },
//         { status: 404 }
//       );
//     }

//     const {
//       basePrice,
//       pricingConfig,
//       title,
//       slug,
//       description,
//       isActive,
//     } = body;

//     const updateData: any = {};

//     // Update basic fields if provided
//     if (title !== undefined) {
//       if (typeof title !== 'string' || !title.trim()) {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             details: {
//               title: 'Title must be a non-empty string',
//             },
//           },
//           { status: 400 }
//         );
//       }
//       updateData.title = title.trim();
//     }

//     if (slug !== undefined) {
//       if (typeof slug !== 'string' || !slug.trim()) {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             details: {
//               slug: 'Slug must be a non-empty string',
//             },
//           },
//           { status: 400 }
//         );
//       }

//       // Check if new slug already exists (and is different from current)
//       if (slug !== existingService.slug) {
//         const slugExists = await prisma.service.findUnique({
//           where: { slug: slug.trim() },
//         });

//         if (slugExists) {
//           return NextResponse.json(
//             {
//               error: 'Service with this slug already exists',
//             },
//             { status: 409 }
//           );
//         }
//       }

//       updateData.slug = slug.trim();
//     }

//     if (description !== undefined) {
//       updateData.description = description ? description.trim() : null;
//     }

//     if (isActive !== undefined) {
//       updateData.isActive = isActive;
//     }

//     // Update price
//     if (basePrice !== undefined) {
//       if (typeof basePrice !== 'number' || basePrice < 0) {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             details: {
//               basePrice: 'Base price must be a non-negative number',
//             },
//           },
//           { status: 400 }
//         );
//       }
//       updateData.basePrice = basePrice;
//     }

//     // Update pricing config - merge with existing
//     if (pricingConfig) {
//       // Validate pricing config
//       if (
//         pricingConfig.discountPercentage !== undefined &&
//         (typeof pricingConfig.discountPercentage !== 'number' ||
//           pricingConfig.discountPercentage < 0 ||
//           pricingConfig.discountPercentage > 100)
//       ) {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             details: {
//               discountPercentage:
//                 'Discount percentage must be between 0 and 100',
//             },
//           },
//           { status: 400 }
//         );
//       }

//       if (
//         pricingConfig.minPrice !== undefined &&
//         (typeof pricingConfig.minPrice !== 'number' ||
//           pricingConfig.minPrice < 0)
//       ) {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             details: {
//               minPrice: 'Minimum price must be a non-negative number',
//             },
//           },
//           { status: 400 }
//         );
//       }

//       if (
//         pricingConfig.maxPrice !== undefined &&
//         (typeof pricingConfig.maxPrice !== 'number' ||
//           pricingConfig.maxPrice < 0)
//       ) {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             details: {
//               maxPrice: 'Maximum price must be a non-negative number',
//             },
//           },
//           { status: 400 }
//         );
//       }

//       // Merge with existing pricingConfig
//       const existingConfig = (existingService.pricingConfig as any) || {};
//       updateData.pricingConfig = {
//         ...existingConfig,
//         ...pricingConfig,
//       };
//     }

//     const updatedService = await prisma.service.update({
//       where: { id: serviceId },
//       data: updateData,
//     });

//     return NextResponse.json(updatedService);
//   } catch (error) {
//     console.error('Error updating service:', error);
//     return NextResponse.json(
//       {
//         error: 'Failed to update service',
//         message: error instanceof Error ? error.message : 'Unknown error',
//       },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // ============================================================================
// // DELETE: Delete service
// // ============================================================================

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ serviceId: string }> }
// ) {
//   try {
//     const { serviceId } = await params;

//     // Check if service exists
//     const existingService = await prisma.service.findUnique({
//       where: { id: serviceId },
//     });

//     if (!existingService) {
//       return NextResponse.json(
//         {
//           error: 'Service not found',
//         },
//         { status: 404 }
//       );
//     }

//     // Delete the service
//     const deletedService = await prisma.service.delete({
//       where: { id: serviceId },
//     });

//     return NextResponse.json({
//       message: 'Service deleted successfully',
//       deletedService,
//     });
//   } catch (error) {
//     console.error('Error deleting service:', error);
//     return NextResponse.json(
//       {
//         error: 'Failed to delete service',
//         message: error instanceof Error ? error.message : 'Unknown error',
//       },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }