import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Settings, Lightbulb, Building, Trophy, User, Phone, Home, Pencil, LayoutGrid } from 'lucide-react';
import AdminHero from '@/components/admin/AdminHero';
import AdminCompetences from '@/components/admin/AdminCompetences';
import AdminDomaines from '@/components/admin/AdminDomaines';
import AdminRealisations from '@/components/admin/AdminRealisations';
import AdminFounder from '@/components/admin/AdminFounder';
import AdminContact from '@/components/admin/AdminContact';
import AdminSections from '@/components/admin/AdminSections';
import AdminCompetencesPageHero from '@/components/admin/AdminCompetencesPageHero';
import AdminDomainsPageHero from '@/components/admin/AdminDomainsPageHero';
import AdminRealisationsPageHero from '@/components/admin/AdminRealisationsPageHero'; // Import new component

const Admin = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                Administration - LA MAITRISE ENGINEERING
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Pencil className="h-4 w-4" />
                  <span>Éditer le site</span>
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Dashboard d'administration
          </h2>
          <p className="text-muted-foreground">
            Gérez le contenu de votre site web. Pour éditer les textes du site, 
            <Link to="/" className="text-primary hover:underline ml-1">
              activez le mode édition sur le site
            </Link>.
          </p>
        </div>

        <Tabs defaultValue="sections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10"> {/* Increased grid columns to 10 */}
            <TabsTrigger value="sections" className="flex items-center space-x-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Sections</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </TabsTrigger>
            <TabsTrigger value="competences" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Compétences</span>
            </TabsTrigger>
            <TabsTrigger value="competences-page-hero" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Page Compétences</span>
            </TabsTrigger>
            <TabsTrigger value="domaines" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Domaines</span>
            </TabsTrigger>
            <TabsTrigger value="domains-page-hero" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Page Domaines</span>
            </TabsTrigger>
            <TabsTrigger value="realisations" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Réalisations</span>
            </TabsTrigger>
            <TabsTrigger value="realisations-page-hero" className="flex items-center space-x-2"> {/* New tab */}
              <Trophy className="h-4 w-4" />
              <span>Page Réalisations</span>
            </TabsTrigger>
            <TabsTrigger value="founder" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Fondateur</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections">
            <AdminSections />
          </TabsContent>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Gestion de la section Accueil</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminHero />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competences">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminCompetences />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competences-page-hero">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Hero de la page Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminCompetencesPageHero />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domaines">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des domaines d'intervention</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminDomaines />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains-page-hero">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Hero de la page Domaines</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminDomainsPageHero />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realisations">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des réalisations</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminRealisations />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realisations-page-hero"> {/* New tab content */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Hero de la page Réalisations</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminRealisationsPageHero />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="founder">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du fondateur</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminFounder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des textes contact</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminContact />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;