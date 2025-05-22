// src/common/types/user.ts
import { RoleType } from '../../common';

export interface TokenPayload {
  id: string;
  role: RoleType;
  [key: string]: string | number | RoleType;
}