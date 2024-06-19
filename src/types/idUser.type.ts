import { Request } from 'express';

export interface AuthenticatedRequestUserId extends Request {
    userId: string;
}
