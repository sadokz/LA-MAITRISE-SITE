import React from 'react';
import { CheckCircle, Award, Users, Lightbulb } from 'lucide-react';
import founderImage from '@/assets/ahmed-zgolli.jpg';
import { useFounder } from '@/hooks/useSupabaseData';

const Founder = () => {
  const { founder, loading } = useFounder();
  
  const values = [
    {
      icon: Lightbulb,
      title: founder?.value_1_title || "Innovation",
      description: founder?.value_1_description || "Intégration des dernières technologies et solutions avant-gardistes"
    },
    {
      icon: Award,
      title: founder?.value_2_title || "Rigueur", 
      description: founder?.value_2_description || "Excellence technique et respect des normes les plus strictes"
    },
    {
      icon: Users,
      title: founder?.value_3_title || "Satisfaction client",
      description: founder?.value_3_description || "Écoute attentive et solutions personnalisées pour chaque projet"
    }
  ];

  if (loading) {
    return (
      <section id="fondateur" className="section-padding bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fondateur" className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="animate-fade-up">
              <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
                Rencontrez{' '}
                <span className="text-gradient-primary">{founder?.name || 'Ahmed Zgolli'}</span>
                <br />Le Fondateur
              </h2>
              
              <div className="text-lg text-gray-medium mb-8 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: founder?.bio_html || 
                     'Ahmed Zgolli, ingénieur électricien principal depuis 1988, est le fondateur et ingénieur conseil de LA MAITRISE ENGINEERING.' }} />
              
              
              {/* Experience Highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-dark font-medium">
                    {founder?.experience_text_1 || 'Ingénieur électricien diplômé depuis'} {founder?.since_year || 1988}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-dark font-medium">
                    {founder?.experience_text_2 || 'Fondateur de LA MAITRISE ENGINEERING en'} {founder?.founder_since || 1993}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-dark font-medium">
                    {(founder?.experience_text_3 || 'Plus de {years} ans d\'expérience en ingénierie électrique')
                      .replace('{years}', String(new Date().getFullYear() - (founder?.since_year || 1988)))}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-dark font-medium">
                    {founder?.experience_text_4 || 'Expert reconnu en BIM et technologies innovantes'}
                  </span>
                </div>
              </div>

              {/* Quote */}
              {founder?.quote && (
                <div className="bg-gradient-card rounded-xl p-6 border-l-4 border-primary">
                  <blockquote className="text-lg text-gray-dark italic mb-4">
                    "{founder.quote}"
                  </blockquote>
                  <cite className="text-primary font-medium">- {founder.name}, Fondateur</cite>
                </div>
              )}
            </div>
            
            {/* Image & Values */}
            <div className="space-y-8 animate-scale-in">
              {/* Founder Image */}
              <div className="text-center">
                <div className="inline-block relative">
                  <img 
                    src={founder?.photo_path || founderImage}
                    alt={`${founder?.name || 'Ahmed Zgolli'}, Fondateur de LA MAITRISE ENGINEERING`}
                    className="w-80 h-96 object-cover rounded-2xl shadow-elegant"
                    loading="lazy"
                    width="320"
                    height="384"
                    onError={(e) => {
                      e.currentTarget.src = founderImage;
                    }}
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-hover">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold">{new Date().getFullYear() - (founder?.since_year || 1988)}+</div>
                      <div className="text-xs">années</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Values */}
              <div className="space-y-6">
                <h3 className="font-heading font-semibold text-xl text-gray-dark text-center mb-6">
                  {founder?.values_title || 'Nos Valeurs Fondamentales'}
                </h3>
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-light/50 transition-colors">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-gray-dark mb-1">
                          {value.title}
                        </h4>
                        <p className="text-sm text-gray-muted">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;