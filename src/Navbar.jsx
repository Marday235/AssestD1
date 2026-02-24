import React from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-10 py-4 bg-transparent backdrop-blur-md shadow-sm">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-800">
            <img className="h-15 w-15 rounded-full" src="/Assestd.JPG" alt="" />
          </h1>
        </div>

        {/* Menu */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-red-600">Home</a>
          <a href="#" className="hover:text-red-600">About Us</a>
          <a href="#" className="hover:text-red-600">Pages</a>
          <a href="#" className="hover:text-red-600">Courses</a>
          <a href="#" className="hover:text-red-600">Events</a>
          <a href="#" className="hover:text-red-600">Contact</a>
        </nav>

        {/* Button */}
        <Button className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition">
          Apply Now
        </Button>
      </div>
    </header>
  );
}