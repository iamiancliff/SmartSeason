// src/services/user.service.ts
import { prisma } from '../lib/prisma.ts';

export class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { fields: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        fields: {
          select: {
            id: true,
            name: true,
            cropType: true,
            currentStage: true,
          },
        },
      },
    });
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  }

  static async updateUserRole(userId: string, role: 'ADMIN' | 'AGENT') {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });
    return user;
  }

  static async deleteUser(userId: string) {
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    return user;
  }
}
