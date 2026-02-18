import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'
export const isAdminOrOwner: Access = ({ req }) => ['admin', 'owner'].includes(req.user?.role ?? '')
