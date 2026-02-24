import React from "react";
import type { Instructor } from "./InstructorSection";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

interface Props {
  instructor: Instructor;
}

const InstructorCard: React.FC<Props> = ({ instructor }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-start gap-6 hover:shadow-xl transition duration-300">
      
      {/* Avatar */}
      <img
        src={instructor.image}
        alt={instructor.name}
        className="w-24 h-24 rounded-full object-cover"
      />

      {/* Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {instructor.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3">{instructor.role}</p>

        <p className="text-gray-600 text-sm mb-4">
          {instructor.description}
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 text-red-600">
          <FaFacebookF className="cursor-pointer hover:text-red-800 transition" />
          <FaTwitter className="cursor-pointer hover:text-red-800 transition" />
          <FaInstagram className="cursor-pointer hover:text-red-800 transition" />
          <FaLinkedinIn className="cursor-pointer hover:text-red-800 transition" />
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;