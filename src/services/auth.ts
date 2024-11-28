interface User {
  email: string;
  role: 'Administrateur' | 'Technicien' | 'Superviseur';
}

interface UserWithPassword extends User {
  password: string;
}

const USERS: UserWithPassword[] = [
  { email: 'admin@datacenterexperts.net', password: 'pass', role: 'Administrateur' },
  { email: 'technicien@datecenterexperts.net', password: 'pass', role: 'Technicien' }
];

export const authenticate = (email: string, password: string): User | null => {
  const user = USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user') !== null;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const login = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem('user');
};
