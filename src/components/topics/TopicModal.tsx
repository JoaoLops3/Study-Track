import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Topic } from '@/types';
import { useTopicStore } from '@/store/topicStore';

interface TopicModalProps {
  topic: Topic;
  onClose: () => void;
}

export function TopicModal({ topic, onClose }: TopicModalProps) {
  const [summary, setSummary] = useState(topic.summary || '');
  const [isSaving, setIsSaving] = useState(false);
  const { updateTopicSummary } = useTopicStore();

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
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {topic.description && (
            <p className="text-gray-300 mb-4">{topic.description}</p>
          )}
          
          <div className="mb-4">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
              Resumo
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Digite seu resumo aqui..."
              className="w-full h-32 p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:bg-gray-600 rounded-md transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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