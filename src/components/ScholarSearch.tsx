import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';

export const ScholarSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary dark:text-white transition-all duration-300"
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-primary dark:text-white">Pesquisa Acadêmica</h3>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Termo de Pesquisa
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite sua pesquisa..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              <ExternalLink size={20} />
              Pesquisar no Google Acadêmico
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Dicas para pesquisa:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Use aspas para frases exatas</li>
              <li>Use site: para pesquisar em sites específicos</li>
              <li>Use filetype: para pesquisar tipos específicos de arquivos</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 