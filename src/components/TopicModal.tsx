import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Topic } from '../types';
import { useStudyStore } from '../store';

interface TopicModalProps {
  topic: Topic;
  onClose: () => void;
}

export function TopicModal({ topic, onClose }: TopicModalProps) {
  const [summary, setSummary] = useState(topic.summary || '');
  const [isSaving, setIsSaving] = useState(false);
  const updateTopicSummary = useStudyStore((state) => state.updateTopicSummary);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateTopicSummary(topic.id, summary);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar resumo:', error);
      alert('Erro ao salvar o resumo. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-700 rounded-lg w-full max-w-2xl text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold">{topic.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-600 rounded-full text-gray-300 transition-colors"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <label className="block mb-2 font-medium text-gray-300">Resumo</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full h-64 p-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            placeholder="Escreva seu resumo aqui..."
            disabled={isSaving}
          />
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:bg-gray-600 rounded-md transition-colors"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}