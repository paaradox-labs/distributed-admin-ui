// Auth Service

import type { Credential } from "../types/types";
import { api } from "./client";

export const login = (credentials: Credential) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
