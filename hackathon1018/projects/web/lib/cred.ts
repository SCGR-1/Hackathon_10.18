export type CredentialType = 'VisaCredential' | 'EducationCredential' | 'EmploymentCredential'

export type Credential = {
  type: CredentialType
  credentialId: string
  issuer: string
  subject: string
  claim: Record<string, unknown>
  issuedAt: string
  validFrom?: string
  expiresAt: string
}

export const SCHEMA_CODES = {
  VISA: 1,
  EDUCATION: 2,
  EMPLOYMENT: 3
} as const

export const CREDENTIAL_TYPES = {
  [SCHEMA_CODES.VISA]: 'VisaCredential',
  [SCHEMA_CODES.EDUCATION]: 'EducationCredential',
  [SCHEMA_CODES.EMPLOYMENT]: 'EmploymentCredential'
} as const

export function stableStringify(input: unknown): string {
  const seen = new WeakSet()
  const sort = (x: any): any => {
    if (x && typeof x === "object") {
      if (seen.has(x)) throw new Error("circular")
      seen.add(x)
      if (Array.isArray(x)) return x.map(sort)
      return Object.keys(x).sort().reduce((acc, k) => { acc[k] = sort(x[k]); return acc }, {} as any)
    }
    return x
  }
  return JSON.stringify(sort(input))
}

export async function hashCredential(c: Credential): Promise<string> {
  const enc = new TextEncoder().encode(stableStringify(c))
  const buf = await crypto.subtle.digest("SHA-256", enc)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
}

export function getSchemaCode(credentialType: CredentialType): number {
  switch (credentialType) {
    case 'VisaCredential': return SCHEMA_CODES.VISA
    case 'EducationCredential': return SCHEMA_CODES.EDUCATION
    case 'EmploymentCredential': return SCHEMA_CODES.EMPLOYMENT
    default: throw new Error(`Unknown credential type: ${credentialType}`)
  }
}

export function getCredentialType(schemaCode: number): CredentialType {
  const type = CREDENTIAL_TYPES[schemaCode as keyof typeof CREDENTIAL_TYPES]
  if (!type) throw new Error(`Unknown schema code: ${schemaCode}`)
  return type as CredentialType
}