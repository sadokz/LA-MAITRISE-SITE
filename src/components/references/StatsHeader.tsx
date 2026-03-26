"use client";

import React from 'react';
import { Trophy, MapPin, Users, Calendar } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts } from '@/hooks/useSupabaseData';

const StatsHeader = () => {
  const { getSiteText } = useSiteTexts();

  const stats = [
    {
      label: "Projets réalisés",
      value: getSiteText('references', 'stats', 'projects_count', '500+'),
      icon: Trophy,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Villes couvertes",
      value: getSiteText('references', 'stats', 'cities_count', '24'),
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Clients satisfaits",
      value: getSiteText('references', 'stats', 'clients_count', '150+'),
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      label: "Années d'expertise",
      value: getSiteText('references', 'stats', 'experience_years', '30'),
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="w-full mb-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-4">
          <EditableText 
            textKey="references.dashboard.title" 
            defaultValue="Nos Références" 
            as="span" 
          />
        </h1>
        <p className="text-xl text-gray-medium">
          <EditableText 
            textKey="references.dashboard.subtitle" 
            defaultValue="Plus de 30 ans d'excellence en ingénierie électrique à travers plus de 500 projets d'envergure." 
            as="span" 
            multiline 
          />
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-elegant border border-border/50 flex flex-col items-center text-center group hover:shadow-hover transition-all duration-300">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-dark mb-1">{stat.value}</div>
            <div className="text-sm text-gray-muted font-medium uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsHeader;