import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
  isAdmin: boolean;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  setEditMode: () => {},
  isAdmin: false,
});

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isEditMode, setEditMode] = useState(false);
  
  const isAdmin = !!user;

  return (
    <EditModeContext.Provider value={{ isEditMode, setEditMode, isAdmin }}>
      {children}
    </EditModeContext.Provider>
  );
};
