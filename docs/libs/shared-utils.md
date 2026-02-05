# Shared Utils

Biblioteca de utilitários compartilhados entre aplicações do monorepo.

## Instalação

```typescript
import { isValidEmail, formatDateBR } from '@monorepo/shared-utils';
```

## Módulos

### Validation
- `isValidEmail(email: string): boolean`
- `isValidCPF(cpf: string): boolean`
- `isValidCNPJ(cnpj: string): boolean`
- `sanitizeString(input: string): string`

### Date
- `formatDateBR(date: Date | string): string`
- `formatDateTimeBR(date: Date | string): string`
- `startOfDay(date?: Date): Date`
- `endOfDay(date?: Date): Date`
- `addDays(date: Date, days: number): Date`
- `isWeekend(date: Date): boolean`
- `getAge(birthDate: Date | string): number`

### Formatters
- `capitalizeFirst(str: string): string`
- `capitalizeWords(str: string): string`
- `truncateText(text: string, maxLength: number, suffix?: string): string`
- `removeSpecialChars(str: string): string`
- `formatCurrency(value: number, locale?: string, currency?: string): string`
- `formatNumber(value: number, decimals?: number, locale?: string): string`
- `formatPhoneBR(phone: string): string`
- `generateSlug(text: string): string`

### HTTP
- `buildQueryString(params: Record<string, string | number | boolean | undefined>): string`
- `parseQueryString(queryString: string): Record<string, string>`
- `buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>): string`
- `delay(ms: number): Promise<void>`
- `retry<T>(fn: () => Promise<T>, maxAttempts?: number, delayMs?: number): Promise<T>`
