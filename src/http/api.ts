// Auth Service

import type { Credential } from "../types/types";
import { api } from "./client";

export const login = (credentials: Credential) =>
  api.post("/auth/login", credentials);
