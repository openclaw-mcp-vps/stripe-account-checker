import { promises as fs } from "node:fs";
import path from "node:path";

import type { AssessmentInput, RiskReportData } from "@/lib/risk-calculator";

type AssessmentRecord = {
  id: string;
  createdAt: string;
  input: AssessmentInput;
  report: RiskReportData;
};

type PurchaseRecord = {
  sessionId: string;
  customerEmail: string | null;
  createdAt: string;
  redeemedAt: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const ASSESSMENTS_PATH = path.join(DATA_DIR, "assessments.json");
const PURCHASES_PATH = path.join(DATA_DIR, "purchases.json");

const inMemory = {
  assessments: new Map<string, AssessmentRecord>(),
  purchases: new Map<string, PurchaseRecord>()
};

let fsEnabled = true;

async function ensureFile(filePath: string, defaultValue: string) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, defaultValue, "utf8");
  }
}

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  try {
    await ensureFile(filePath, "[]");
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    fsEnabled = false;
    return [];
  }
}

async function writeJsonArray<T>(filePath: string, values: T[]) {
  if (!fsEnabled) return;
  try {
    await fs.writeFile(filePath, JSON.stringify(values, null, 2), "utf8");
  } catch {
    fsEnabled = false;
  }
}

export async function createAssessment(input: AssessmentInput, report: RiskReportData) {
  const id = crypto.randomUUID();
  const record: AssessmentRecord = {
    id,
    createdAt: new Date().toISOString(),
    input,
    report
  };

  if (!fsEnabled) {
    inMemory.assessments.set(id, record);
    return record;
  }

  const current = await readJsonArray<AssessmentRecord>(ASSESSMENTS_PATH);
  current.unshift(record);
  await writeJsonArray(ASSESSMENTS_PATH, current.slice(0, 500));
  return record;
}

export async function getAssessment(id: string) {
  if (!fsEnabled) return inMemory.assessments.get(id) ?? null;

  const current = await readJsonArray<AssessmentRecord>(ASSESSMENTS_PATH);
  return current.find((entry) => entry.id === id) ?? null;
}

export async function listRecentAssessments(limit = 10) {
  if (!fsEnabled) {
    return Array.from(inMemory.assessments.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  const current = await readJsonArray<AssessmentRecord>(ASSESSMENTS_PATH);
  return current.slice(0, limit);
}

export async function upsertPurchaseSession(sessionId: string, customerEmail: string | null) {
  const normalized: PurchaseRecord = {
    sessionId,
    customerEmail,
    createdAt: new Date().toISOString(),
    redeemedAt: null
  };

  if (!fsEnabled) {
    inMemory.purchases.set(sessionId, normalized);
    return normalized;
  }

  const current = await readJsonArray<PurchaseRecord>(PURCHASES_PATH);
  const existingIndex = current.findIndex((entry) => entry.sessionId === sessionId);

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      customerEmail: customerEmail ?? current[existingIndex].customerEmail
    };
  } else {
    current.unshift(normalized);
  }

  await writeJsonArray(PURCHASES_PATH, current.slice(0, 1000));
  return normalized;
}

export async function redeemPurchaseSession(sessionId: string) {
  if (!sessionId) return null;

  if (!fsEnabled) {
    const existing = inMemory.purchases.get(sessionId);
    if (!existing) return null;
    existing.redeemedAt = existing.redeemedAt ?? new Date().toISOString();
    inMemory.purchases.set(sessionId, existing);
    return existing;
  }

  const current = await readJsonArray<PurchaseRecord>(PURCHASES_PATH);
  const index = current.findIndex((entry) => entry.sessionId === sessionId);
  if (index < 0) return null;

  current[index] = {
    ...current[index],
    redeemedAt: current[index].redeemedAt ?? new Date().toISOString()
  };
  await writeJsonArray(PURCHASES_PATH, current);
  return current[index];
}
