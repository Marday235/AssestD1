import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const collaborateurs = await ctx.db.query("collaborateurs").order("desc").collect();

    return await Promise.all(
      collaborateurs.map(async (item) => ({
        ...item,
        logoUrl: item.logoStorageId ? await ctx.storage.getUrl(item.logoStorageId) : item.logoUrl,
      }))
    );
  },
});

export const create = mutation({
  args: {
    nom: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    telephone: v.string(),
    email: v.string(),
    adresse: v.string(),
    siteWeb: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("collaborateurs", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("collaborateurs"),
    nom: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    telephone: v.string(),
    email: v.string(),
    adresse: v.string(),
    siteWeb: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("collaborateurs") },
  handler: async (ctx, args) => {
    const collaborateur = await ctx.db.get(args.id);
    if (collaborateur?.logoStorageId) {
      await ctx.storage.delete(collaborateur.logoStorageId);
    }
    await ctx.db.delete(args.id);
  },
});
