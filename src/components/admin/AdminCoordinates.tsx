import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Phone, Mail, Printer, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Coordinate {
  id: string;
  type: 'phone' | 'fax' | 'email';
  value: string;
  label: string | null;
  position: number;
}

const typeConfig = {
  phone: { label: 'Téléphone', icon: Phone, placeholder: '+216 XX XXX XXX' },
  fax: { label: 'Fax', icon: Printer, placeholder: '+216 XX XXX XXX' },
  email: { label: 'Email', icon: Mail, placeholder: 'exemple@domaine.com' },
};

const AdminCoordinates = () => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ value: '', label: '' });
  const [newItem, setNewItem] = useState<{ type: 'phone' | 'fax' | 'email'; value: string; label: string } | null>(null);

  useEffect(() => {
    fetchCoordinates();
  }, []);

  const fetchCoordinates = async () => {
    const { data, error } = await supabase
      .from('contact_coordinates')
      .select('*')
      .order('type')
      .order('position');

    if (!error && data) {
      setCoordinates(data as Coordinate[]);
    }
    setLoading(false);
  };

  const handleAdd = (type: 'phone' | 'fax' | 'email') => {
    setNewItem({ type, value: '', label: '' });
    setEditingId(null);
  };

  const handleSaveNew = async () => {
    if (!newItem || !newItem.value.trim()) {
      toast.error('La valeur est requise');
      return;
    }

    const maxPosition = coordinates
      .filter(c => c.type === newItem.type)
      .reduce((max, c) => Math.max(max, c.position), -1);

    const { error } = await supabase
      .from('contact_coordinates')
      .insert({
        type: newItem.type,
        value: newItem.value.trim(),
        label: newItem.label.trim() || null,
        position: maxPosition + 1,
      });

    if (error) {
      toast.error('Erreur lors de l\'ajout');
      return;
    }

    toast.success('Coordonnée ajoutée');
    setNewItem(null);
    fetchCoordinates();
  };

  const handleEdit = (coord: Coordinate) => {
    setEditingId(coord.id);
    setEditForm({ value: coord.value, label: coord.label || '' });
    setNewItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.value.trim()) {
      toast.error('La valeur est requise');
      return;
    }

    const { error } = await supabase
      .from('contact_coordinates')
      .update({
        value: editForm.value.trim(),
        label: editForm.label.trim() || null,
      })
      .eq('id', editingId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return;
    }

    toast.success('Coordonnée mise à jour');
    setEditingId(null);
    fetchCoordinates();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('contact_coordinates')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }

    toast.success('Coordonnée supprimée');
    fetchCoordinates();
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewItem(null);
    setEditForm({ value: '', label: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderSection = (type: 'phone' | 'fax' | 'email') => {
    const config = typeConfig[type];
    const Icon = config.icon;
    const items = coordinates.filter(c => c.type === type);

    return (
      <Card key={type}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {config.label}s
            </CardTitle>
            <Button size="sm" onClick={() => handleAdd(type)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((coord) => (
              <div
                key={coord.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
              >
                {editingId === coord.id ? (
                  <>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Valeur</Label>
                        <Input
                          value={editForm.value}
                          onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                          placeholder={config.placeholder}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Label (optionnel)</Label>
                        <Input
                          value={editForm.label}
                          onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="Ex: Principal, Bureau..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{coord.value}</p>
                      {coord.label && (
                        <p className="text-xs text-muted-foreground">{coord.label}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(coord)}>
                        Modifier
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(coord.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {items.length === 0 && !newItem && (
              <p className="text-center text-muted-foreground py-4">
                Aucun {config.label.toLowerCase()} configuré
              </p>
            )}

            {newItem?.type === type && (
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Valeur</Label>
                    <Input
                      value={newItem.value}
                      onChange={(e) => setNewItem(prev => prev ? { ...prev, value: e.target.value } : null)}
                      placeholder={config.placeholder}
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Label (optionnel)</Label>
                    <Input
                      value={newItem.label}
                      onChange={(e) => setNewItem(prev => prev ? { ...prev, label: e.target.value } : null)}
                      placeholder="Ex: Principal, Bureau..."
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={handleSaveNew}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderSection('phone')}
      {renderSection('fax')}
      {renderSection('email')}
    </div>
  );
};

export default AdminCoordinates;
