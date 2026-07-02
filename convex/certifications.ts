import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const certifications = await ctx.db.query("certifications").order("desc").collect();

    return await Promise.all(
      certifications.map(async (cert) => ({
        ...cert,
        imageUrl: cert.imageStorageId
          ? await ctx.storage.getUrl(cert.imageStorageId)
          : cert.imageUrl,
      }))
    );
  },
});

export const create = mutation({
  args: {
    nom: v.string(),
    organisme: v.string(),
    numero: v.string(),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    dateObtention: v.string(),
    dateExpiration: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("certifications", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("certifications"),
    nom: v.string(),
    organisme: v.string(),
    numero: v.string(),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    dateObtention: v.string(),
    dateExpiration: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("certifications") },
  handler: async (ctx, args) => {
    const cert = await ctx.db.get(args.id);
    if (cert?.imageStorageId) {
      await ctx.storage.delete(cert.imageStorageId);
    }
    await ctx.db.delete(args.id);
  },
});
