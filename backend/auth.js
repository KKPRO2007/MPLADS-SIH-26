import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const ROLES = {
  MP: "mp",
  DISTRICT_AUTHORITY: "district_authority",
  IMPLEMENTING_AGENCY: "implementing_agency",
  STATE_NODAL_AUTHORITY: "state_nodal_authority",
  MOSPI: "mospi",
  MINISTRY: "ministry",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [ROLES.MP]: "Member of Parliament",
  [ROLES.DISTRICT_AUTHORITY]: "District Authority",
  [ROLES.IMPLEMENTING_AGENCY]: "Implementing Agency",
  [ROLES.STATE_NODAL_AUTHORITY]: "State Nodal Authority",
  [ROLES.MOSPI]: "MoSPI",
  [ROLES.MINISTRY]: "Ministry",
  [ROLES.ADMIN]: "Administrator",
};

const developmentUsers = [
  { id: "demo-admin", email: "admin@mplads.local", password: "change-me", role: ROLES.ADMIN, scope: "national" },
];

function usersFromEnvironment() {
  if (!process.env.MPLADS_USERS_JSON) return developmentUsers;
  try {
    const users = JSON.parse(process.env.MPLADS_USERS_JSON);
    if (!Array.isArray(users)) throw new Error("MPLADS_USERS_JSON must be an array");
    return users;
  } catch (error) {
    throw new Error(`Invalid MPLADS_USERS_JSON: ${error.message}`);
  }
}

function secret() {
  return process.env.JWT_SECRET || "change-me-in-production";
}

export async function authenticate(email, password) {
  const user = usersFromEnvironment().find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const valid = user.passwordHash
    ? await bcrypt.compare(password, user.passwordHash)
    : user.password === password;
  if (!valid) return null;
  return { id: user.id, email: user.email, role: user.role, scope: user.scope || "national", name: user.name || ROLE_LABELS[user.role] };
}

export function createToken(user) {
  return jwt.sign(user, secret(), { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
}

export function requireAuth(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return response.status(401).json({ error: "Authentication required." });
  try {
    request.user = jwt.verify(token, secret(), { algorithms: ["HS256"] });
    return next();
  } catch {
    return response.status(401).json({ error: "Invalid or expired access token." });
  }
}

export function requireRoles(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) return response.status(403).json({ error: "This action is not available for your role." });
    return next();
  };
}

export function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role, roleLabel: ROLE_LABELS[user.role], scope: user.scope, name: user.name };
}
