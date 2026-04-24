// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.ts';

export class AuthService {
  static async register(data: any) {
    const { email, password, name, location } = data;
    // role is intentionally ignored — all self-registered users are AGENT
    // Only an ADMIN can promote a user via PUT /api/users/:id/role

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw { status: 400, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        location,
        role: 'AGENT',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1d' }
    );

    return { user: userWithoutPassword, token };
  }

  static async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        profilePhoto: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw { status: 404, message: 'User not found' };

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  static async uploadProfilePhoto(userId: string, filePath: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw { status: 404, message: 'User not found' };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: filePath },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        profilePhoto: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}
