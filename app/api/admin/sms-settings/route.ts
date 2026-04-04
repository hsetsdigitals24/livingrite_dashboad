import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';


/**
 * GET /api/admin/sms-settings
 * Fetch current SMS reminder settings
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let settings = await prisma.sMSReminderSettings.findFirst();

    // If no settings exist, create defaults
    if (!settings) {
      settings = await prisma.sMSReminderSettings.create({
        data: {
          preConsultationTemplate: "Hi {clientName}, your LivingRite consultation is in 12 hours ({consultationTime}). Please join 5-10 minutes early. Reply with any questions!",
          preConsultationEnabled: true,
          postConsultationTemplate: "Hi {clientName}, thank you for your consultation! We'd love your feedback: {feedbackLink}. Reply if you have any questions!",
          postConsultationEnabled: true,
          followUpTemplate: "Hi {clientName}, following up from your consultation. How are you doing? Let us know if you have any questions. We're here to help!",
          followUpEnabled: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch SMS settings:', errorMsg);
    return NextResponse.json(
      { error: 'Failed to fetch SMS settings', details: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/sms-settings
 * Update SMS reminder settings
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      preConsultationTemplate,
      preConsultationEnabled,
      postConsultationTemplate,
      postConsultationEnabled,
      followUpTemplate,
      followUpEnabled,
    } = body;

    // Validate templates contain required variables
    const requiredVars = {
      preConsultation: ['{clientName}', '{consultationTime}'],
      postConsultation: ['{clientName}', '{feedbackLink}'],
      followUp: ['{clientName}'],
    };

    if (
      preConsultationTemplate &&
      !requiredVars.preConsultation.every((v) => preConsultationTemplate.includes(v))
    ) {
      return NextResponse.json(
        {
          error: 'Invalid template',
          message: `Pre-consultation template must include: ${requiredVars.preConsultation.join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (
      postConsultationTemplate &&
      !requiredVars.postConsultation.every((v) => postConsultationTemplate.includes(v))
    ) {
      return NextResponse.json(
        {
          error: 'Invalid template',
          message: `Post-consultation template must include: ${requiredVars.postConsultation.join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (
      followUpTemplate &&
      !requiredVars.followUp.every((v) => followUpTemplate.includes(v))
    ) {
      return NextResponse.json(
        {
          error: 'Invalid template',
          message: `Follow-up template must include: ${requiredVars.followUp.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Get or create settings
    let settings = await prisma.sMSReminderSettings.findFirst();

    if (!settings) {
      settings = await prisma.sMSReminderSettings.create({
        data: {
          preConsultationTemplate: preConsultationTemplate || "Hi {clientName}, your LivingRite consultation is in 12 hours ({consultationTime}). Please join 5-10 minutes early. Reply with any questions!",
          preConsultationEnabled: preConsultationEnabled !== undefined ? preConsultationEnabled : true,
          postConsultationTemplate: postConsultationTemplate || "Hi {clientName}, thank you for your consultation! We'd love your feedback: {feedbackLink}. Reply if you have any questions!",
          postConsultationEnabled: postConsultationEnabled !== undefined ? postConsultationEnabled : true,
          followUpTemplate: followUpTemplate || "Hi {clientName}, following up from your consultation. How are you doing? Let us know if you have any questions. We're here to help!",
          followUpEnabled: followUpEnabled !== undefined ? followUpEnabled : true,
        },
      });
    } else {
      settings = await prisma.sMSReminderSettings.update({
        where: { id: settings.id },
        data: {
          ...(preConsultationTemplate && { preConsultationTemplate }),
          ...(preConsultationEnabled !== undefined && { preConsultationEnabled }),
          ...(postConsultationTemplate && { postConsultationTemplate }),
          ...(postConsultationEnabled !== undefined && { postConsultationEnabled }),
          ...(followUpTemplate && { followUpTemplate }),
          ...(followUpEnabled !== undefined && { followUpEnabled }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'SMS settings updated successfully',
      data: settings,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to update SMS settings:', errorMsg);
    return NextResponse.json(
      { error: 'Failed to update SMS settings', details: errorMsg },
      { status: 500 }
    );
  }
}
