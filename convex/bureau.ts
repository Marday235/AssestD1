import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Récupère tous les membres du bureau, triés du plus récent au plus ancien. */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const membres = await ctx.db.query("bureau").order("desc").collect();

    return await Promise.all(
      membres.map(async (membre) => ({
        ...membre,
        photoUrl: membre.photoStorageId
          ? await ctx.storage.getUrl(membre.photoStorageId)
          : membre.photoUrl,
      }))
    );
  },
});

export const create = mutation({
  args: {
    nom: v.string(),
    prenom: v.string(),
    telephone: v.string(),
    photoStorageId: v.optional(v.id("_storage")),
    role: v.string(),
    niveauEtude: v.string(),
    statut: v.union(v.literal("Présent"), v.literal("Ancien")),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bureau", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("bureau"),
    nom: v.string(),
    prenom: v.string(),
    telephone: v.string(),
    photoStorageId: v.optional(v.id("_storage")),
    role: v.string(),
    niveauEtude: v.string(),
    statut: v.union(v.literal("Présent"), v.literal("Ancien")),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("bureau") },
  handler: async (ctx, args) => {
    const membre = await ctx.db.get(args.id);
    if (membre?.photoStorageId) {
      await ctx.storage.delete(membre.photoStorageId);
    }
    await ctx.db.delete(args.id);
  },
});
