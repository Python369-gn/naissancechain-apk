import { BirthFormData, BirthRecord } from '@/types/birth';

function checksum(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

export function createRecordId(sequence = 1, date = new Date()) {
  const year = date.getFullYear();
  return `NC-${year}-${String(sequence).padStart(4, '0')}`;
}

export function createProofHash(payload: BirthFormData, id: string) {
  const canonical = [
    id,
    payload.childFirstName.trim().toUpperCase(),
    payload.childLastName.trim().toUpperCase(),
    payload.birthDate,
    payload.birthPlace.trim().toUpperCase(),
    payload.fatherName.trim().toUpperCase(),
    payload.motherName.trim().toUpperCase(),
    payload.healthCenter.trim().toUpperCase(),
  ].join('|');

  return `NCH-${checksum(canonical)}-${checksum(canonical.split('').reverse().join(''))}`;
}

export function buildVerificationPayload(record: BirthRecord) {
  return `📜 CERTIFICAT DE NAISSANCE\n` +
         `------------------------\n` +
         `🆔 ID: ${record.id}\n` +
         `👶 ENFANT: ${record.childFirstName.toUpperCase()} ${record.childLastName.toUpperCase()}\n` +
         `⚧ SEXE: ${record.sex}\n` +
         `📅 DATE: ${record.birthDate} à ${record.birthTime}\n` +
         `📍 LIEU: ${record.birthPlace}\n` +
         `👩 MÈRE: ${record.motherName}\n` +
         `👨 PÈRE: ${record.fatherName || 'Non renseigné'}\n` +
         `------------------------\n` +
         `✅ VÉRIFIÉ PAR NAISSANCECHAIN\n` +
         `🔗 HASH: ${record.proofHash.substring(0, 12)}...`;
}
