import { openDB } from 'idb';

const dbName = 'study-track-auth';
const storeName = 'users';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const dbPromise = openDB(dbName, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, { keyPath: 'id' });
      store.createIndex('email', 'email', { unique: true });
      store.createIndex('created_at', 'createdAt');
    }
  },
});

export const authDB = {
  // Buscar usuário por email
  getUserByEmail: async (email: string): Promise<User | undefined> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index('email');
    return index.get(email);
  },

  // Buscar usuário por ID
  getUserById: async (id: string): Promise<User | undefined> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.get(id);
  },

  // Adicionar novo usuário
  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    await store.add(newUser);
    return newUser.id;
  },

  // Verificar se email já existe
  checkEmailExists: async (email: string): Promise<boolean> => {
    const user = await authDB.getUserByEmail(email);
    return !!user;
  },

  // Atualizar usuário
  updateUser: async (id: string, updates: Partial<User>): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const user = await store.get(id);
    
    if (user) {
      await store.put({ ...user, ...updates });
    }
  },

  // Deletar usuário
  deleteUser: async (id: string): Promise<void> => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(id);
  }
}; 