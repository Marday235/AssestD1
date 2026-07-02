import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Génère une URL d'upload signée à usage unique vers Convex Storage.
 * Le client (ImageUploader) fait un POST direct vers cette URL avec le fichier,
 * puis récupère le storageId retourné dans la réponse pour le passer aux
 * mutations create()/update() des modules (bureau, collaborateurs, etc.).
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/** Résout l'URL publique d'un fichier stocké à partir de son storageId. */
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
