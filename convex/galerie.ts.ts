import { query } from "./_generated/server";

export const getAllPhotos = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("galerie")
      .order("desc")
      .collect();
  },
});