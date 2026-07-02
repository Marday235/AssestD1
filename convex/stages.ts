import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const MONTANT_STAGE = 1000;

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const candidatures = await ctx.db.query("stages").order("desc").collect();

    return await Promise.all(
      candidatures.map(async (candidature) => ({
        ...candidature,
        dossierUrl: candidature.dossierStorageId
          ? await ctx.storage.getUrl(candidature.dossierStorageId)
          : candidature.dossierUrl,
      }))
    );
  },
});

export const create = mutation({
  args: {
    nom: v.string(),
    age: v.string(),
    niveau: v.string(),
    numero: v.string(),
    lettreMotivation: v.string(),
    dossierStorageId: v.optional(v.id("_storage")),
    dossierNom: v.optional(v.string()),
    statutPaiement: v.union(v.literal("Payé"), v.literal("Non payé")),
    datePaiement: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stages", { ...args, montant: MONTANT_STAGE });
  },
});

export const update = mutation({
  args: {
    id: v.id("stages"),
    nom: v.string(),
    age: v.string(),
    niveau: v.string(),
    numero: v.string(),
    lettreMotivation: v.string(),
    dossierStorageId: v.optional(v.id("_storage")),
    dossierNom: v.optional(v.string()),
    statutPaiement: v.union(v.literal("Payé"), v.literal("Non payé")),
    datePaiement: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("stages") },
  handler: async (ctx, args) => {
    const candidature = await ctx.db.get(args.id);
    if (candidature?.dossierStorageId) {
      await ctx.storage.delete(candidature.dossierStorageId);
    }
    await ctx.db.delete(args.id);
  },
});
