import { openDB } from 'idb';

const dbName = 'study-track-db';
const storeName = 'topics';

const dbPromise = openDB(dbName, 1, {
  upgrade(db) {
    // Criar o object store se não existir
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, { keyPath: 'id' });
      store.createIndex('status', 'status');
      store.createIndex('created_at', 'created_at');
    }
  },
});

export const dbFunctions = {
  // Buscar todos os tópicos
  getAllTopics: async () => {
    const db = await dbPromise;
    return db.getAll(storeName);
  },

  // Adicionar um novo tópico
  addTopic: async (topic: { id: string; title: string; summary: string; status: string }) => {
    const db = await dbPromise;
    const topicWithTimestamp = {
      ...topic,
      created_at: new Date().toISOString()
    };
    return db.add(storeName, topicWithTimestamp);
  },

  // Atualizar o status de um tópico
  updateTopicStatus: async (id: string, status: string) => {
    const db = await dbPromise;
    const topic = await db.get(storeName, id);
    if (topic) {
      topic.status = status;
      return db.put(storeName, topic);
    }
  },

  // Deletar um tópico
  deleteTopic: async (id: string) => {
    const db = await dbPromise;
    return db.delete(storeName, id);
  },

  // Atualizar o resumo de um tópico
  updateTopicSummary: async (id: string, summary: string) => {
    const db = await dbPromise;
    const topic = await db.get(storeName, id);
    if (topic) {
      topic.summary = summary;
      return db.put(storeName, topic);
    }
  }
};

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const db = await dbPromise;
    console.log('Conexão com o banco de dados estabelecida:', db.name);
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return false;
  }
}; 