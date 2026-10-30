import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, FarmerProfile } from '../types';
import { db } from '../db/sqlDatabase';

interface AuthContextType {
  currentUser: User | null;
  farmerProfile: FarmerProfile | null;
  isFarmer: boolean;
  isConsumer: boolean;
  isAdmin: boolean;
  login: (email: string) => boolean;
  register: (userData: Omit<User, 'id' | 'created_at'>, farmerExtra?: Partial<FarmerProfile>) => User;
  switchUserRole: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'agriconnect_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);

  // Initialize from storage or default to Gayathri Devi (Consumer) for immediate pleasant marketplace test-drive
  useEffect(() => {
    db.init();
    const savedUserId = localStorage.getItem(STORAGE_KEY_AUTH);
    const users = db.executeRawSQL('SELECT * FROM users').data as User[] || [];

    if (savedUserId) {
      const found = users.find(u => u.id === Number(savedUserId));
      if (found) {
        setCurrentUser(found);
        return;
      }
    }

    // Default to Consumer Gayathri Devi
    const defaultConsumer = users.find(u => u.role === 'consumer') || users[0];
    if (defaultConsumer) {
      setCurrentUser(defaultConsumer);
      localStorage.setItem(STORAGE_KEY_AUTH, String(defaultConsumer.id));
    }
  }, []);

  // Sync farmer profile when user changes
  useEffect(() => {
    if (currentUser && currentUser.role === 'farmer') {
      const profile = db.getFarmerByUserId(currentUser.id);
      setFarmerProfile(profile || null);
    } else {
      setFarmerProfile(null);
    }
  }, [currentUser]);

  const login = (email: string): boolean => {
    const res = db.executeRawSQL(`SELECT * FROM users WHERE email = '${email.trim().toLowerCase()}'`);
    if (res.data && res.data.length > 0) {
      const user = res.data[0] as User;
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEY_AUTH, String(user.id));
      return true;
    }
    return false;
  };

  const register = (
    userData: Omit<User, 'id' | 'created_at'>,
    farmerExtra?: Partial<FarmerProfile>
  ): User => {
    const allUsers = db.executeRawSQL('SELECT * FROM users').data as User[] || [];
    const maxId = allUsers.reduce((max, u) => Math.max(max, u.id), 0);
    const newId = maxId + 1;

    const newUser: User = {
      ...userData,
      id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    db.executeRawSQL(`
      INSERT INTO users (id, email, full_name, role, phone, address, city, state, pincode, created_at)
      VALUES (${newId}, '${newUser.email}', '${newUser.full_name}', '${newUser.role}', '${newUser.phone}', '${newUser.address}', '${newUser.city}', '${newUser.state}', '${newUser.pincode}', '${newUser.created_at}')
    `);

    if (newUser.role === 'farmer' && farmerExtra) {
      const allFarmers = db.getAllFarmers();
      const maxFarmerId = allFarmers.reduce((max, f) => Math.max(max, f.id), 0);
      const newFarmerId = maxFarmerId + 1;

      const profile: FarmerProfile = {
        id: newFarmerId,
        user_id: newId,
        farm_name: farmerExtra.farm_name || `${newUser.full_name}'s Organic Farm`,
        farm_location: farmerExtra.farm_location || newUser.city,
        state: newUser.state,
        total_acres: farmerExtra.total_acres || 5.0,
        organic_certified: farmerExtra.organic_certified ?? true,
        upi_id: farmerExtra.upi_id || `${newUser.email.split('@')[0]}@okhdfcbank`,
        rating: 5.0,
        total_sales_kg: 0,
        bio: farmerExtra.bio || 'Passionate about sustainable organic farming and direct-to-consumer fresh produce.',
        phone: newUser.phone
      };

      db.executeRawSQL(`
        INSERT INTO farmers (id, user_id, farm_name, farm_location, state, total_acres, organic_certified, upi_id, rating, total_sales_kg, bio, phone)
        VALUES (${newFarmerId}, ${newId}, '${profile.farm_name}', '${profile.farm_location}', '${profile.state}', ${profile.total_acres}, ${profile.organic_certified ? 1 : 0}, '${profile.upi_id}', 5.0, 0, '${profile.bio.replace(/'/g, "\\'")}', '${profile.phone}')
      `);
    }

    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEY_AUTH, String(newUser.id));
    return newUser;
  };

  const switchUserRole = (role: UserRole) => {
    const allUsers = db.executeRawSQL('SELECT * FROM users').data as User[] || [];
    const target = allUsers.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(STORAGE_KEY_AUTH, String(target.id));
    }
  };

  const logout = () => {
    // Re-default to guest or consumer
    switchUserRole('consumer');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);

    const sets = Object.entries(data)
      .map(([k, v]) => `${k} = '${String(v).replace(/'/g, "\\'")}'`)
      .join(', ');

    if (sets) {
      db.executeRawSQL(`UPDATE users SET ${sets} WHERE id = ${currentUser.id}`);
    }
  };

  const isFarmer = currentUser?.role === 'farmer';
  const isConsumer = currentUser?.role === 'consumer';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        farmerProfile,
        isFarmer,
        isConsumer,
        isAdmin,
        login,
        register,
        switchUserRole,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
