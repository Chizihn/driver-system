import { RequestHandler } from 'express';
import { AuthenticatedRequest } from '../types';
import { UserRole } from '@prisma/client';

export const roleMiddleware = (allowedRoles: UserRole[]): RequestHandler => {
  return (req: AuthenticatedRequest, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
