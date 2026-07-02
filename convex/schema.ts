import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bureau: defineTable({
    nom: v.string(),
    prenom: v.string(),
    telephone: v.string(),
    age: v.string(),
    photoStorageId: v.optional(v.id("_storage")),
    photoUrl: v.optional(v.string()),
    role: v.string(),
    niveauEtude: v.string(),
    statut: v.union(v.literal("Présent"), v.literal("Ancien")),
    bio: v.optional(v.string()),
  })
    .index("by_statut", ["statut"])
    .index("by_nom", ["nom"]),

  collaborateurs: defineTable({
    nom: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    logoUrl: v.optional(v.string()),
    telephone: v.string(),
    email: v.string(),
    adresse: v.string(),
    siteWeb: v.optional(v.string()),
    description: v.optional(v.string()),
  }).index("by_nom", ["nom"]),

  evenements_galerie: defineTable({
    nom: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
  }).index("by_date", ["date"]),

  galerie: defineTable({
    evenementId: v.id("evenements_galerie"),
    imageStorageId: v.id("_storage"),
    ordre: v.number(),
  }).index("by_evenement", ["evenementId"]),

  certifications: defineTable({
    nom: v.string(),
    organisme: v.string(),
    numero: v.string(),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    dateObtention: v.string(),
    dateExpiration: v.optional(v.string()),
  }).index("by_organisme", ["organisme"]),

  stages: defineTable({
    nom: v.string(),
    age: v.string(),
    numero: v.string(),
    niveau: v.string(),
    lettreMotivation: v.string(),
    dossierStorageId: v.optional(v.id("_storage")),
    dossierUrl: v.optional(v.string()),
    dossierNom: v.optional(v.string()),
    montant: v.number(),
    statutPaiement: v.union(v.literal("Payé"), v.literal("Non payé")),
    datePaiement: v.optional(v.string()),
  })
    .index("by_statutPaiement", ["statutPaiement"])
    .index("by_nom", ["nom"]),
});
