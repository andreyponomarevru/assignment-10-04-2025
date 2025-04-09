import { prisma } from "../config/db";

type Request = {
  subject?: string;
  message?: string;
};

export const requests = {
  async create({ subject, message }: Request) {
    return await prisma.request.create({
      data: {
        statusId: 1,
        subject: subject || null,
        message: message || null,
      },
      select: {
        createdAt: true,
        id: true,
        message: true,
        statusId: true,
        subject: true,
      },
    });
  },

  async read(date?: string, start?: string, end?: string) {
    let requests = null;
    const fieldsToReturn = {
      id: true,
      subject: true,
      response: true,
      createdAt: true,
      statusId: true,
      cancellationReason: true,
    };
    const excludeCancelledRequests = { statusId: { not: 4 } };

    if (date) {
      requests = await prisma.request.findMany({
        select: fieldsToReturn,
        where: {
          createdAt: new Date(date).toISOString(),
          ...excludeCancelledRequests,
        },
      });
    } else if (start && end) {
      requests = await prisma.request.findMany({
        select: fieldsToReturn,
        where: {
          createdAt: {
            gte: new Date(start).toISOString(),
            lte: new Date(end).toISOString(),
          },
          ...excludeCancelledRequests,
        },
      });
    } else {
      requests = await prisma.request.findMany({
        select: fieldsToReturn,
        where: { ...excludeCancelledRequests },
      });
    }

    return requests;
  },

  async cancel(id: number, cancellationReason?: string) {
    await prisma.request.update({
      where: { id },
      data: {
        statusId: 4,
        cancellationReason: cancellationReason || null,
      },
    });
  },

  async destroy() {
    await prisma.request.updateMany({
      where: { statusId: 2 },
      data: { statusId: 4 },
    });
  },

  async moveToPending(requestId: number) {
    await prisma.request.update({
      where: { id: requestId },
      data: { statusId: 2 },
    });
  },

  async mvToFinished(requestId: number, response = null) {
    const finishedStatusId = 3;

    const r = await prisma.request.update({
      data: { statusId: finishedStatusId, response },
      where: { id: requestId },
    });

    console.log(r);
  },

  async isPending(requestId: number) {
    const pendingStatusId = 2;

    const cancelledRequestId = await prisma.request.findUnique({
      where: { id: requestId, statusId: pendingStatusId },
    });

    return cancelledRequestId !== null;
  },
};
