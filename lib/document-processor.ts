/**
 * Utilitaire pour traiter différents formats de documents
 */

interface DocumentMetadata {
  filename: string;
  fileType: string;
  fileSize: number;
  pages?: number;
  wordCount?: number;
}

interface ProcessingResult {
  text: string;
  metadata: DocumentMetadata;
  error?: string;
}

/**
 * Simule l'extraction de texte depuis différents formats de documents
 * Dans une vraie implémentation, on utiliserait :
 * - PDF: pdf-parse, pdf.js
 * - DOC/DOCX: mammoth.js
 * - TXT: lecture directe
 * - CSV: parsing CSV
 * - XLS/XLSX: xlsx, sheetjs
 * - ODT: odt.js
 */
export async function processDocument(file: File): Promise<ProcessingResult> {
  const metadata: DocumentMetadata = {
    filename: file.name,
    fileType: file.type,
    fileSize: file.size,
  };

  try {
    // Pour la simulation, on retourne un texte factice basé sur le type de fichier
    let extractedText = '';

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      extractedText = `[PDF Document: ${file.name}]
      
Ceci est une simulation d'extraction de texte depuis un PDF d'appel d'offres.
Dans une vraie implémentation, on utiliserait une bibliothèque comme pdf-parse.

Contenu typique d'un appel d'offres :
- Titre du marché
- Organisme acheteur
- Budget estimé
- Critères d'attribution
- Délais de réponse
- Exigences techniques

Page 1: Appel d'offres pour fourniture de matériel informatique
Page 2: Critères d'évaluation : Prix (60%), Valeur technique (25%), Délai (15%)
Page 3: Exigences : Certification ISO 9001, Garantie 3 ans minimum`;

      metadata.pages = 3;
      metadata.wordCount = 85;
    } else if (file.type.includes('word') || file.name.toLowerCase().match(/\.docx?$/)) {
      extractedText = `[Document Word: ${file.name}]

APPEL D'OFFRES - FOURNITURE DE MATÉRIEL

1. OBJET DU MARCHÉ
Fourniture de matériel informatique pour l'administration.

2. BUDGET
Montant estimé : 85 000 - 120 000 € HT

3. DÉLAIS
Date limite de dépôt : 15 avril 2026
Durée du marché : 24 mois

4. CRITÈRES D'ATTRIBUTION
- Prix : 60%
- Valeur technique : 25% 
- Délai de livraison : 15%`;

      metadata.wordCount = 65;
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      extractedText = await file.text();
      metadata.wordCount = extractedText.split(/\s+/).length;
    } else if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
      const text = await file.text();
      extractedText = `[Fichier CSV: ${file.name}]

Données extraites :
${text}

Analyse des colonnes détectées :
- Lot
- Description
- Quantité
- Prix unitaire
- Total`;
    } else if (file.type.includes('excel') || file.name.toLowerCase().match(/\.xlsx?$/)) {
      extractedText = `[Fichier Excel: ${file.name}]

Feuille 1: Détail des lots
- Lot 1: Ordinateurs portables (50 unités)
- Lot 2: Écrans 24" (30 unités)  
- Lot 3: Imprimantes (15 unités)

Feuille 2: Planning de livraison
- J+30: Livraison Lot 1
- J+45: Livraison Lot 2
- J+60: Livraison Lot 3

Budget total estimé : 95 000 €`;
    } else if (file.type.includes('opendocument') || file.name.toLowerCase().endsWith('.odt')) {
      extractedText = `[Document ODT: ${file.name}]

MARCHÉ PUBLIC DE FOURNITURES

Article 1 - Objet
Le présent marché a pour objet la fourniture de matériel informatique.

Article 2 - Durée
La durée du marché est fixée à vingt-quatre (24) mois.

Article 3 - Prix
Les prix sont fermes et non révisables.

Article 4 - Modalités de paiement
Paiement à 30 jours fin de mois.`;
    } else {
      // Fallback pour les types non reconnus
      extractedText = `[Document: ${file.name} - Type: ${file.type}]

Contenu du document non extrait (format non supporté ou erreur d'extraction).

Dans une vraie implémentation, on ajouterait :
1. Bibliothèques d'extraction spécifiques
2. OCR pour les documents scannés
3. Parsing des tableaux et structures complexes`;
    }

    return {
      text: extractedText,
      metadata,
    };
  } catch (error: any) {
    return {
      text: '',
      metadata,
      error: `Erreur lors du traitement du document: ${error.message}`,
    };
  }
}

/**
 * Détecte le type de document et retourne des informations utiles
 */
export function getDocumentInfo(file: File): {
  type: 'pdf' | 'word' | 'excel' | 'text' | 'csv' | 'odt' | 'unknown';
  icon: string;
  description: string;
} {
  const name = file.name.toLowerCase();

  if (name.endsWith('.pdf')) {
    return { type: 'pdf', icon: '📄', description: 'Document PDF' };
  }
  if (name.endsWith('.doc') || name.endsWith('.docx')) {
    return { type: 'word', icon: '📝', description: 'Document Word' };
  }
  if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
    return { type: 'excel', icon: '📊', description: 'Feuille Excel' };
  }
  if (name.endsWith('.txt')) {
    return { type: 'text', icon: '📃', description: 'Document texte' };
  }
  if (name.endsWith('.csv')) {
    return { type: 'csv', icon: '📋', description: 'Fichier CSV' };
  }
  if (name.endsWith('.odt')) {
    return { type: 'odt', icon: '📑', description: 'Document ODT' };
  }

  return { type: 'unknown', icon: '📎', description: 'Document' };
}
