import 'server-only';
import type { RequestStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { AvailabilityRequestInput } from '@/schemas/availability.schema';

export async function createAvailabilityRequest(
  input: AvailabilityRequestInput,
  userId?: string | null
) {
  // On tente de rattacher la demande a un modele de PC connu.
  const laptop = await prisma.laptop.findFirst({
    where: {
      model: { equals: input.laptopModel, mode: 'insensitive' },
      brand: { name: { equals: input.brandName, mode: 'insensitive' } }
    },
    select: { id: true }
  });

  return prisma.availabilityRequest.create({
    data: {
      userId: userId ?? null,
      laptopId: laptop?.id ?? null,
      customerName: input.customerName,
      phone: input.phone,
      whatsapp: input.whatsapp || null,
      brandName: input.brandName,
      laptopModel: input.laptopModel,
      type: input.type,
      knownRef: input.knownRef || null,
      message: input.message || null,
      imageUrl: input.imageUrl || null
    }
  });
}

export async function getRequests(status?: RequestStatus) {
  return prisma.availabilityRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}

export async function getRequestsByUser(userId: string) {
  return prisma.availabilityRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateRequestStatus(requestId: string, status: RequestStatus, adminNote?: string) {
  return prisma.availabilityRequest.update({
    where: { id: requestId },
    data: { status, adminNote: adminNote || null }
  });
}
