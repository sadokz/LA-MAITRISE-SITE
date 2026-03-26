"use client";

import React from 'react';
import { MapPin, Calendar, ArrowRight, Hash } from 'lucide-react';
import { Reference } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Reference;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const displayImage = project.image_file || project.image_url || getRelevantFallbackImage(project.title + project.category, project.category.toLowerCase());

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border/50 shadow-elegant hover:shadow-hover transition-all duration-300 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={displayImage} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary/90 hover:bg-primary text-white border-none shadow-sm">
            {project.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-heading font-bold text-lg text-gray-dark leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-gray-medium">
          {project.emplacement && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1 text-primary" />
              {project.emplacement.split(',')[0]}
            </div>
          )}
          {project.date_text && (
            <div className="flex items-center">
              <Calendar size={14} className="mr-1 text-primary" />
              {project.date_text}
            </div>
          )}
          {project.reference && (
            <div className="flex items-center">
              <Hash size={14} className="mr-1 text-primary" />
              {project.reference}
            </div>
          )}
        </div>

        <p className="text-gray-muted text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>

        <Button 
          variant="outline" 
          className="w-full justify-between group/btn border-border hover:border-primary hover:bg-primary/5 text-gray-dark hover:text-primary"
          onClick={onClick}
        >
          Voir détails
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;