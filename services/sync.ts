import { BirthRecord } from '@/types/birth';
import { CONFIG } from '@/constants/config';

const API_URL = CONFIG.API_URL; 

export async function syncPendingRecords(records: BirthRecord[], online: boolean) {
  if (!online) {
    return records;
  }

  const results = [...records];
  const now = new Date().toISOString();

  for (let i = 0; i < results.length; i++) {
    const record = results[i];
    
    if (record.status === 'pending' || record.status === 'failed') {
      try {
        console.log(`Syncing record ${record.id}...`);
        
        // Map BirthRecord to Backend Enregistrement model (Simplified)
        const payload = {
          niu: record.childId || record.id,
          nom: record.childLastName,
          prenom: record.childFirstName,
          sexe: record.sex === 'Masculin' ? 'M' : 'F',
          date: record.birthDate,
          heure: record.birthTime,
          prefecture: "CONAKRY", // Valeur par défaut pour l'agent mobile
          commune: record.birthPlace || "Inconnue",
          lieuPrecis: record.hospital || record.healthCenter || "Hôpital",
          statut: "EN ATTENTE",
          agent: record.agentName || "Agent Mobile",
          agentId: "AG-MOBILE-01",
          // Filiation
          nomPere: record.fatherName || "Inconnu",
          nomMere: record.motherName || "Inconnue",
          // Metadata
          hashBlock: record.proofHash
        };

        const response = await fetch(`${API_URL}/enregistrements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          results[i] = {
            ...record,
            status: 'synced',
            syncedAt: now,
          };
          console.log(`Successfully synced record ${record.id}`);
        } else {
          const errorData = await response.json();
          console.error(`Failed to sync record ${record.id}:`, errorData);
          results[i] = {
            ...record,
            status: 'failed',
          };
        }
      } catch (error) {
        console.error(`Error syncing record ${record.id}:`, error);
        results[i] = {
          ...record,
          status: 'failed',
        };
      }
    }
  }

  return results;
}
