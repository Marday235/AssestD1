import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const MONTANT_STAGE = 1000;

/** Récupère tous les stagiaires avec leurs photos résolues. */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const candidatures = await ctx.db.query("stages").order("desc").collect();
    return await Promise.all(
      candidatures.map(async (c) => {
        const photos = await ctx.db
          .query("stage_photos")
          .withIndex("by_stage", (q) => q.eq("stageId", c._id))
          .order("asc")
          .collect();
        const photosAvecUrl = await Promise.all(
          photos.map(async (p) => ({
            ...p,
            imageUrl: await ctx.storage.getUrl(p.imageStorageId),
          }))
        );
        return { ...c, photos: photosAvecUrl };
      })
    );
  },
});

/** Récupère un seul stagiaire par ID avec toutes ses photos. */
export const getById = query({
  args: { id: v.id("stages") },
  handler: async (ctx, args) => {
    const candidature = await ctx.db.get(args.id);
    if (!candidature) return null;
    const photos = await ctx.db
      .query("stage_photos")
      .withIndex("by_stage", (q) => q.eq("stageId", args.id))
      .order("asc")
      .collect();
    const photosAvecUrl = await Promise.all(
      photos.map(async (p) => ({
        ...p,
        imageUrl: await ctx.storage.getUrl(p.imageStorageId),
      }))
    );
    return { ...candidature, photos: photosAvecUrl };
  },
});

export const create = mutation({
  args: {
    nom: v.string(),
    niveau: v.string(),
    numero: v.string(),
    lettreMotivation: v.string(),
    datePaiement: v.optional(v.string()),
    photoStorageIds: v.optional(v.array(v.id("_storage"))),
  },

  handler: async (ctx, { photoStorageIds, ...rest }) => {
    const id = await ctx.db.insert("stages", {
      ...rest,
      montant: MONTANT_STAGE,
      statutPaiement: "Non payé",
    });

    if (photoStorageIds?.length) {
      await Promise.all(
        photoStorageIds.map((storageId, ordre) =>
          ctx.db.insert("stage_photos", {
            stageId: id,
            imageStorageId: storageId,
            ordre,
          })
        )
      );
    }

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("stages"),
    nom: v.string(),
    niveau: v.string(),
    numero: v.string(),
    lettreMotivation: v.string(),
    statutPaiement: v.union(v.literal("Payé"), v.literal("Non payé")),
    datePaiement: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

/** Ajoute des photos supplémentaires à un stagiaire existant. */
export const addPhotos = mutation({
  args: {
    stageId: v.id("stages"),
    photoStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const existantes = await ctx.db
      .query("stage_photos")
      .withIndex("by_stage", (q) => q.eq("stageId", args.stageId))
      .collect();
    const base = existantes.length;
    await Promise.all(
      args.photoStorageIds.map((storageId, i) =>
        ctx.db.insert("stage_photos", { stageId: args.stageId, imageStorageId: storageId, ordre: base + i })
      )
    );
  },
});

/** Supprime une photo individuelle d'un stagiaire. */
export const removePhoto = mutation({
  args: { id: v.id("stage_photos") },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (photo) {
      await ctx.storage.delete(photo.imageStorageId);
      await ctx.db.delete(args.id);
    }
  },
});

/** Supprime un stagiaire et toutes ses photos. */
export const remove = mutation({
  args: { id: v.id("stages") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("stage_photos")
      .withIndex("by_stage", (q) => q.eq("stageId", args.id))
      .collect();
    await Promise.all(
      photos.map(async (p) => {
        await ctx.storage.delete(p.imageStorageId);
        await ctx.db.delete(p._id);
      })
    );
    await ctx.db.delete(args.id);
  },
});

/** Bascule le statut de paiement en Payé avec la date du jour. */
export const markAsPaid = mutation({
  args: { id: v.id("stages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      statutPaiement: "Payé",
      datePaiement: new Date().toISOString().slice(0, 10),
    });
  },
});
