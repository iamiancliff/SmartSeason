import { prisma } from '../lib/prisma.ts';

export class FieldService {
  private static computeStatus(field: any) {
    if (field.currentStage === 'HARVESTED') return 'COMPLETED';

    const lastUpdate = field.updates?.[0];
    const referenceDate = lastUpdate
      ? new Date(lastUpdate.createdAt)
      : new Date(field.plantingDate);
    const daysSinceReference =
      (Date.now() - referenceDate.getTime()) / (1000 * 3600 * 24);

    if (daysSinceReference > 7) return 'AT_RISK';
    return 'ACTIVE';
  }

  static async createField(data: any) {
    return prisma.field.create({
      data: {
        name: data.name,
        cropType: data.cropType,
        plantingDate: new Date(data.plantingDate),
        location: data.location,
        currentStage: data.currentStage || 'PLANTED',
      }
    });
  }

  static async getAllFields(userId?: string, role?: string) {
    const fields = await prisma.field.findMany({
      where: role === 'AGENT' ? { assignedToId: userId } : {},
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        updates: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    return fields.map(field => ({
      ...field,
      status: this.computeStatus(field)
    }));
  }

  static async getFieldById(id: string, userId: string, role: string) {
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        updates: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!field) throw { status: 404, message: 'Field not found' };

    if (role === 'AGENT' && field.assignedToId !== userId) {
      throw { status: 403, message: 'Access denied to this field' };
    }

    return {
      ...field,
      status: this.computeStatus(field)
    };
  }

  static async assignAgent(fieldId: string, agentId: string) {
    const agent = await prisma.user.findUnique({ where: { id: agentId } });
    if (!agent || agent.role !== 'AGENT') {
      throw { status: 400, message: 'Invalid agent ID' };
    }

    return prisma.field.update({
      where: { id: fieldId },
      data: { assignedToId: agentId }
    });
  }

  static async addUpdate(fieldId: string, agentId: string, data: any) {
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) throw { status: 404, message: 'Field not found' };

    if (field.assignedToId !== agentId) {
      throw { status: 403, message: 'Not authorized to update this field' };
    }

    // atomic-ish operation (sequential)
    return await prisma.$transaction(async (tx) => {
      const update = await tx.fieldUpdate.create({
        data: {
          fieldId,
          agentId,
          stage: data.stage,
          note: data.note
        }
      });

      const updatedField = await tx.field.update({
        where: { id: fieldId },
        data: { currentStage: data.stage }
      });

      return { update, field: updatedField };
    });
  }

  static async updateField(id: string, data: any) {
    return prisma.field.update({
      where: { id },
      data: {
        name: data.name,
        cropType: data.cropType,
        plantingDate: data.plantingDate ? new Date(data.plantingDate) : undefined,
        location: data.location,
        currentStage: data.currentStage
      }
    });
  }

  static async deleteField(id: string) {
    return prisma.field.delete({ where: { id } });
  }

  static async getFieldUpdates(fieldId: string, userId: string, role: string) {
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) throw { status: 404, message: 'Field not found' };

    if (role === 'AGENT' && field.assignedToId !== userId) {
      throw { status: 403, message: 'Access denied to this field' };
    }

    return prisma.fieldUpdate.findMany({
      where: { fieldId },
      include: {
        agent: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
