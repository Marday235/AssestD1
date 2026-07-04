import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Événements ────────────────────────────────────────────────────────────────

/** Retourne tous les événements avec leurs photos (URLs résolues) et le nombre de photos. */
export const getAllEvenements = query({
  args: {},
  handler: async (ctx) => {
    const evenements = await ctx.db
      .query("evenements_galerie")
      .order("desc")
      .collect();

    return await Promise.all(
      evenements.map(async (evt) => {
        const photos = await ctx.db
          .query("galerie")
          .withIndex("by_evenement", (q) => q.eq("evenementId", evt._id))
          .order("asc")
          .collect();

        const photosAvecUrl = await Promise.all(
          photos.map(async (p) => ({
            ...p,
            imageUrl: await ctx.storage.getUrl(p.imageStorageId),
          }))
        );

        return {
          ...evt,
          photos: photosAvecUrl,
          nombrePhotos: photos.length,
          couvertureUrl: photosAvecUrl[0]?.imageUrl ?? null,
        };
      })
    );
  },
});
export const getPhotosHasard = query({
  args: {},
  handler: async (ctx) => {
    const photos = await ctx.db
      .query("galerie")
      .collect();

    const photosAvecUrl = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        imageUrl: await ctx.storage.getUrl(photo.imageStorageId),
      }))
    );

    // Mélange Fisher-Yates
    for (let i = photosAvecUrl.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [photosAvecUrl[i], photosAvecUrl[j]] = [
        photosAvecUrl[j],
        photosAvecUrl[i],
      ];
    }

    // Retourne seulement 8 photos
    return photosAvecUrl.slice(0, 10);
  },
});

export const createEvenement = mutation({
  args: {
    nom: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("evenements_galerie", args);
  },
});

export const updateEvenement = mutation({
  args: {
    id: v.id("evenements_galerie"),
    nom: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

/** Supprime un événement et toutes ses photos (Storage + documents). */
export const removeEvenement = mutation({
  args: { id: v.id("evenements_galerie") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("galerie")
      .withIndex("by_evenement", (q) => q.eq("evenementId", args.id))
      .collect();

    await Promise.all(
      photos.map(async (photo) => {
        await ctx.storage.delete(photo.imageStorageId);
        await ctx.db.delete(photo._id);
      })
    );

    await ctx.db.delete(args.id);
  },
});

// ─── Photos ────────────────────────────────────────────────────────────────────

/** Ajoute plusieurs photos en lot à un événement existant. */
export const addPhotos = mutation({
  args: {
    evenementId: v.id("evenements_galerie"),
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Détermine l'ordre de départ (photos existantes)
    const existantes = await ctx.db
      .query("galerie")
      .withIndex("by_evenement", (q) => q.eq("evenementId", args.evenementId))
      .collect();

    const baseOrdre = existantes.length;

    await Promise.all(
      args.storageIds.map((storageId, index) =>
        ctx.db.insert("galerie", {
          evenementId: args.evenementId,
          imageStorageId: storageId,
          ordre: baseOrdre + index,
        })
      )
    );
  },
});

/** Supprime une seule photo (Storage + document). */
export const removePhoto = mutation({
  args: { id: v.id("galerie") },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (photo) {
      await ctx.storage.delete(photo.imageStorageId);
      await ctx.db.delete(args.id);
    }
  },
});
