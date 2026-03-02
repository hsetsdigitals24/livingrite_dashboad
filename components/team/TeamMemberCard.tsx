"use client";

import { Mail, Linkedin } from "lucide-react";
import { useState } from "react";

interface TeamMember {
  name: string;
  title: string;
  image: string;
  bio: string;
  email?: string;
  linkedin?: string;
  specialties?: string[];
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow */}
      <div
        className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
      />

      <div className="relative h-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay gradient on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        {/* Content Container */}
        <div className="relative p-8">
          {/* Name and Title */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
              {member.name}
            </h3>
            <p className="text-base font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {member.title}
            </p>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
            {member.bio}
          </p>

          {/* Specialties - only show on hover */}
          {member.specialties && member.specialties.length > 0 && (
            <div
              className="mb-6 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {member.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(member.email || member.linkedin) && (
            <div
              className="flex gap-3 border-t border-gray-100 pt-6 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
            >
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  title={`Email ${member.name}`}
                >
                  <Mail size={18} />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  title={`LinkedIn profile of ${member.name}`}
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Accent bar */}
        <div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        />
      </div>
    </div>
  );
}
