import React from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminEditBar: React.FC = () => {
  const { isAdmin, isEditMode, setEditMode } = useEditMode();
  const { user, signOut } = useAuth();

  if (!isAdmin || !user) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-dark/95 backdrop-blur-sm text-white py-2 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white/80">
            Mode Admin
          </span>
          <div className="flex items-center gap-2">
            <Switch
              id="edit-mode"
              checked={isEditMode}
              onCheckedChange={setEditMode}
              className="data-[state=checked]:bg-orange"
            />
            <label
              htmlFor="edit-mode"
              className={`text-sm font-medium flex items-center gap-1 cursor-pointer ${
                isEditMode ? 'text-orange' : 'text-white/60'
              }`}
            >
              <Pencil className="w-4 h-4" />
              Édition {isEditMode ? 'ON' : 'OFF'}
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 hidden sm:inline">
            {user.email}
          </span>
          <Link to="/admin">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditBar;
