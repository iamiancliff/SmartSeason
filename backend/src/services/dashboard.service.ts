// src/services/dashboard.service.ts
import { prisma } from '../lib/prisma';

// Reuse status computation logic (same as FieldService)
function computeStatus(field: any): string {
  if (field.currentStage === 'HARVESTED') return 'COMPLETED';

  const lastUpdate = field.updates[0];
  const daysSinceUpdate = lastUpdate
    ? (Date.now() - new Date(lastUpdate.createdAt).getTime()) / (1000 * 3600 * 24)
    : (Date.now() - new Date(field.createdAt).getTime()) / (1000 * 3600 * 24);

  if (daysSinceUpdate > 7) return 'AT_RISK';
  return 'ACTIVE';
}

export class DashboardService {
  static async getAdminDashboard() {
    const fields = await prisma.field.findMany({
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        updates: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    const fieldsWithStatus = fields.map((f) => ({ ...f, status: computeStatus(f) }));

    const stats = {
      total: fieldsWithStatus.length,
      active: fieldsWithStatus.filter((f) => f.status === 'ACTIVE').length,
      atRisk: fieldsWithStatus.filter((f) => f.status === 'AT_RISK').length,
      completed: fieldsWithStatus.filter((f) => f.status === 'COMPLETED').length,
      unassigned: fieldsWithStatus.filter((f) => !f.assignedToId).length,
    };

    const recentUpdates = await prisma.fieldUpdate.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        field: { select: { id: true, name: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    const totalAgents = await prisma.user.count({ where: { role: 'AGENT' } });

    return { stats, fields: fieldsWithStatus, recentUpdates, totalAgents };
  }

  static async getAgentDashboard(agentId: string) {
    const fields = await prisma.field.findMany({
      where: { assignedToId: agentId },
      include: {
        updates: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    const fieldsWithStatus = fields.map((f) => ({ ...f, status: computeStatus(f) }));

    const stats = {
      total: fieldsWithStatus.length,
      active: fieldsWithStatus.filter((f) => f.status === 'ACTIVE').length,
      atRisk: fieldsWithStatus.filter((f) => f.status === 'AT_RISK').length,
      completed: fieldsWithStatus.filter((f) => f.status === 'COMPLETED').length,
    };

    const recentUpdates = await prisma.fieldUpdate.findMany({
      where: { agentId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        field: { select: { id: true, name: true } },
      },
    });

    return { stats, fields: fieldsWithStatus, recentUpdates };
  }
}
