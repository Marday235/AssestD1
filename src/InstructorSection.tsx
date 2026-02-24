import React from "react";
import InstructorCard from "./InstructorCard";

export interface Instructor {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
}

  const  instructors: Instructor[] = [
  {
    id: 1,
    name: "Alisson Becker",
    role: "Professor",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut.",
  },
  {
    id: 2,
    name: "Saiko Najran",
    role: "Professor",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut.",
  },
  {
    id: 3,
    name: "Jurgen Klopp",
    role: "Professor",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut.",
  },
  {
    id: 4,
    name: "Alberto Moreno",
    role: "Professor",
    image: "https://randomuser.me/api/portraits/men/60.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut.",
  },
];

const InstructorSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-red-600 font-medium mb-2">Our Instructor</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Meet Our Expert Teachers
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorSection ;