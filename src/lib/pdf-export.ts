import { MONTANT_STAGE } from "@/components/dashboard/Stage/stage.types";
import type { CandidatureStage } from "@/components/dashboard/Stage/stage.types";
import { formatDate } from "@/lib/utils";

// Palette "registre civique" du dashboard, en RGB pour jsPDF.
const COULEUR_PRIMARY: [number, number, number] = [32, 33, 36];      // Anthracite
const COULEUR_ACCENT: [number, number, number] = [37, 99, 235];      // Bleu
const COULEUR_MUTED: [number, number, number] = [107, 114, 128];     // Gris
const COULEUR_LIGNE: [number, number, number] = [229, 231, 235];     // Gris clair    // Gris clair

/**
 * Génère et télécharge un PDF listant tous les candidats de stage ayant payé
 * leurs frais de dossier, avec en-tête, tableau récapitulatif et total.
 * jsPDF est chargé dynamiquement pour ne pas alourdir le bundle initial de l'app.
 */
export async function genererPdfCandidatsPayes(candidatures: CandidatureStage[]) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const payes = candidatures.filter((c) => c.statutPaiement === "Payé");

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marge = 40;

  
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setTextColor(...COULEUR_PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Candidatures de stage — Paiements reçus", marge, 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const dateGeneration = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Document généré le ${dateGeneration}`, marge, 55);

  // Résumé
  let curseurY = 105;
  doc.setTextColor(...COULEUR_PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`${payes.length} candidat${payes.length > 1 ? "s" : ""} ayant payé`, marge, curseurY);

  // doc.setTextColor(...COULEUR_ACCENT);
  // const totalPercu = payes.length * MONTANT_STAGE;
  // doc.text(`Total perçu : ${totalPercu.toLocaleString("fr-FR")} FR`, pageWidth - marge, curseurY, {
  //   align: "right",
  // });

  curseurY += 20;

  if (payes.length === 0) {
    doc.setTextColor(...COULEUR_MUTED);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text("Aucun candidat n'a encore payé ses frais de dossier.", marge, curseurY + 10);
  } else {
    autoTable(doc, {
      startY: curseurY,
      margin: { left: marge, right: marge },
      head: [["N°", "Nom", "Numero", "Montant", "Date de paiement"]],
      body: payes.map((c, index) => [
        String(index + 1),
        c.nom,
        c.numero,
        `${MONTANT_STAGE} FR`,
        c.datePaiement ? formatDate(c.datePaiement) : "—",
      ]),
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: [40, 40, 35],
        lineColor: COULEUR_LIGNE,
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: COULEUR_PRIMARY,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 246, 240],
      },
      columnStyles: {
        0: { cellWidth: 24, halign: "center" },
        2: { cellWidth: 100, halign: "center" },
        4: { cellWidth: 70, halign: "right" },
        5: { cellWidth: 100, halign: "right" },
      },
    });
  }

  // Pied de page (numéro de page)
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(...COULEUR_MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(`Page ${page} / ${totalPages}`, pageWidth - marge, pageHeight - 20, { align: "right" });
    // doc.text("Espace Admin — Association", marge, pageHeight - 20);
  }

  const nomFichier = `candidats-payes-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(nomFichier);
}
