import React, { useState } from 'react';
import { X, Cloud, Sparkles } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { CREATE_DREAM } from '@/app/graphql/mutation';

interface DreamRecordPopupProps {
  onClose: () => void;
  onDreamCreated: (dreamData: {
    title: string;
    content: string;
    emotions: string[];
    themes: string[];
  }) => void;}

const DreamRecordPopup: React.FC<DreamRecordPopupProps> = ({ onClose, onDreamCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [createDream, { loading: isSubmitting }] = useMutation(CREATE_DREAM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createDream({
        variables: {
          title: title,
          content: content,
          date: new Date().toISOString(), // Use current date
          emotions: emotions,
          themes: themes,
        },
      });
      onDreamCreated({
        title: title,
        content: content,
        emotions: emotions,
        themes: themes,
      });
      onClose();
    } catch (err) {
      console.error('Error creating dream:', err);
      setError('Failed to create dream. Please try again.');
    }
  };

  const handleEmotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setEmotions(value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setThemes(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Record Your Dream</h2>
          <button onClick={onClose} className="text-white hover:text-purple-300">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-purple-200">
              Dream Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-purple-800 border-purple-600 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-purple-200">
              Dream Description
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md bg-purple-800 border-purple-600 text-white"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="emotions" className="block text-sm font-medium text-purple-200">
              Emotions (comma-separated)
            </label>
            <div className="relative">
              <input
                type="text"
                id="emotions"
                value={emotions.join(', ')}
                onChange={handleEmotionChange}
                className="mt-1 block w-full rounded-md bg-purple-800 border-purple-600 text-white pl-10"
              />
              <Cloud className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            </div>
          </div>
          <div>
            <label htmlFor="themes" className="block text-sm font-medium text-purple-200">
              Themes (comma-separated)
            </label>
            <div className="relative">
              <input
                type="text"
                id="themes"
                value={themes.join(', ')}
                onChange={handleThemeChange}
                className="mt-1 block w-full rounded-md bg-purple-800 border-purple-600 text-white pl-10"
              />
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Dream'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DreamRecordPopup;
