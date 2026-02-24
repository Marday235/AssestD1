import React from "react";

export default function Hero() {
  return (
    <section
      className="relative h-160 w-screen bg-cover bg-center flex items-center justify-center mt-22"
      style={{
        backgroundImage:
          "url('/photo.JPG')",
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Contenu */}
      <div className="relative z-10 text-center text-white max-w-2xl px-4">
        <p className="uppercase tracking-widest mb-4 text-sm">
          Welcome To
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
           ASSESTD 🇹🇩 
        </h1>

        <p className="mb-8 text-gray-200">
          Best Education Theme 2019. Choose this theme for any education
          related WordPress Theme.
        </p>
      </div>
    </section>
  );
}