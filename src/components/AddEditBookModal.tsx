import React, { useState, useEffect } from 'react';
import { Book, Category } from '../types';
import { X, BookPlus, Save } from 'lucide-react';

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: Partial<Book>) => Promise<boolean>;
  editingBook?: Book | null;
  categories: Category[];
}

export const AddEditBookModal: React.FC<AddEditBookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBook,
  categories,
}) => {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [numberOfCopies, setNumberOfCopies] = useState<number>(3);
  const [shelfLocation, setShelfLocation] = useState('Rack CS-101');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setIsbn(editingBook.isbn);
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setPublisher(editingBook.publisher || '');
      setCategoryId(editingBook.categoryId);
      setPublicationYear(editingBook.publicationYear || 2020);
      setNumberOfCopies(editingBook.numberOfCopies);
      setShelfLocation(editingBook.shelfLocation || '');
      setDescription(editingBook.description || '');
    } else {
      setIsbn('978-013' + Math.floor(100000 + Math.random() * 900000));
      setTitle('');
      setAuthor('');
      setPublisher('Academic Press');
      setCategoryId(categories[0]?.id || 1);
      setPublicationYear(2022);
      setNumberOfCopies(4);
      setShelfLocation('Rack CS-105');
      setDescription('');
    }
    setError(null);
  }, [editingBook, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !isbn.trim() || numberOfCopies < 1) {
      setError('Please provide valid values for Title, Author, ISBN, and Copies (min 1).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ok = await onSave({
        id: editingBook ? editingBook.id : undefined,
        isbn: isbn.trim(),
        title: title.trim(),
        author: author.trim(),
        publisher: publisher.trim(),
        categoryId: Number(categoryId),
        publicationYear: Number(publicationYear),
        numberOfCopies: Number(numberOfCopies),
        shelfLocation: shelfLocation.trim(),
        description: description.trim(),
      });
      if (ok) onClose();
      else setError('Failed to save book. Verify ISBN uniqueness or active loans.');
    } catch (err: any) {
      setError(err?.message || 'Error saving book information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookPlus className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-display font-bold text-slate-100">
            {editingBook ? 'Edit Catalogued Volume' : 'Add New Library Volume'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operating Systems: Three Easy Pieces"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Author *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">ISBN *</label>
              <input
                type="text"
                required
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-013..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Publisher</label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Publisher Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Publication Year</label>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Total Copies *</label>
              <input
                type="number"
                min="1"
                required
                value={numberOfCopies}
                onChange={(e) => setNumberOfCopies(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Shelf Location</label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Rack B-12"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Book Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Abstract, course reference notes, or table of contents overview..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving to Database...' : editingBook ? 'Save Updates' : 'Add to Catalogue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
