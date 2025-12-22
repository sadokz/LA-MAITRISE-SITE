import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompetences, Competence } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const AdminCompetences = () => {
  const { competences, fetchCompetences } = useCompetences();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompetence, setEditingCompetence] = useState<Competence | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '⚡',
  });
  const { toast } = useToast();

  const resetForm = () => {
    setForm({ title: '', description: '', icon: '⚡' });
    setEditingCompetence(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCompetence) {
      // Update
      const { error } = await supabase
        .from('competences')
        .update(form)
        .eq('id', editingCompetence.id);

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour la compétence',
          variant: 'destructive',
        });
        return;
      }
    } else {
      // Create
      const maxPosition = Math.max(...competences.map(c => c.position), 0);
      const { error } = await supabase
        .from('competences')
        .insert({ ...form, position: maxPosition + 1 });

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer la compétence',
          variant: 'destructive',
        });
        return;
      }
    }

    toast({
      title: 'Succès',
      description: editingCompetence ? 'Compétence mise à jour' : 'Compétence créée',
    });

    setIsDialogOpen(false);
    resetForm();
    fetchCompetences();
  };

  const handleEdit = (competence: Competence) => {
    setEditingCompetence(competence);
    setForm({
      title: competence.title,
      description: competence.description,
      icon: competence.icon,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      return;
    }

    const { error } = await supabase
      .from('competences')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la compétence',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Compétence supprimée',
    });

    fetchCompetences();
  };

  const handleMovePosition = async (competence: Competence, direction: 'up' | 'down') => {
    const sortedCompetences = [...competences].sort((a, b) => a.position - b.position);
    const currentIndex = sortedCompetences.findIndex(c => c.id === competence.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedCompetences.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetCompetence = sortedCompetences[targetIndex];

    // Swap positions
    const { error } = await supabase
      .from('competences')
      .update({ position: targetCompetence.position })
      .eq('id', competence.id);

    if (!error) {
      await supabase
        .from('competences')
        .update({ position: competence.position })
        .eq('id', targetCompetence.id);
    }

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réorganiser les compétences',
        variant: 'destructive',
      });
      return;
    }

    fetchCompetences();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des compétences</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une compétence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCompetence ? 'Modifier la compétence' : 'Ajouter une compétence'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon">Icône</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCompetence ? 'Mettre à jour' : 'Créer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Icône</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competences
            .sort((a, b) => a.position - b.position)
            .map((competence) => (
              <TableRow key={competence.id}>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMovePosition(competence, 'up')}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMovePosition(competence, 'down')}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-2xl">{competence.icon}</TableCell>
                <TableCell className="font-medium">{competence.title}</TableCell>
                <TableCell className="max-w-xs truncate">{competence.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(competence)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(competence.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCompetences;