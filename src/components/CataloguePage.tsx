import React, { useState, useMemo } from 'react';
import { Book, Category, User } from '../types';
import { BookCoverBadge } from './BookCoverBadge';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  BookOpen,
  Plus,
  Eye,
  BookmarkCheck,
} from 'lucide-react';

interface CataloguePageProps {
  books: Book[];
  categories: Category[];
  currentUser: User | null;
  onSelectBook: (book: Book) => void;
  onRequestBorrow: (book: Book) => void;
  onOpenAddBookModal: () => void;
  onOpenAuthModal: () => void;
  initialSearchQuery?: string;
}

export const CataloguePage: React.FC<CataloguePageProps> = ({
  books,
  categories,
  currentUser,
  onSelectBook,
  onRequestBorrow,
  onOpenAddBookModal,
  onOpenAuthModal,
  initialSearchQuery = '',
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q) ||
        (book.categoryName && book.categoryName.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'ALL' || book.categoryId === selectedCategory;

      const matchesAvailability = !availableOnly || book.availableCopies > 0;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, search, selectedCategory, availableOnly]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100">
            Library Book Catalogue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse holdings, inspect shelf locations, and initiate borrowing requests
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentUser?.role === 'ROLE_ADMIN' && (
            <button
              onClick={onOpenAddBookModal}
              className="px-4 py-2 text-xs font-semibold tracking-wide text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add New Volume
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-amber-400/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-amber-400/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search input */}
          <div className="relative md:col-span-7">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalogue by title, author, or ISBN..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
                )
              }
              aria-label="Filter books by category"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80"
            >
              <option value="ALL">All Categories ({books.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400/30 bg-slate-950 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pill Filters (Clickable buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((cat) => {
            const count = books.filter((b) => b.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Content */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No volumes match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting category filters to display all library assets.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setAvailableOnly(false);
            }}
            className="px-4 py-1.5 text-xs text-amber-400 border border-amber-400/30 rounded-lg hover:bg-amber-400/10 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div
                key={book.id}
                className="rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-4 transition-all hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex gap-3 mb-3">
                    <BookCoverBadge
                      title={book.title}
                      author={book.author}
                      categoryName={book.categoryName}
                      coverStyle={book.coverStyle}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 truncate">
                        {book.categoryName}
                      </div>
                      <h3
                        onClick={() => onSelectBook(book)}
                        className="font-semibold text-slate-100 text-sm line-clamp-2 hover:text-amber-300 cursor-pointer transition-colors"
                      >
                        {book.title}
                      </h3>
                      <div className="text-xs text-slate-400 truncate">
                        by {book.author}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono-numbers">
                        Pub: {book.publicationYear} · {book.publisher}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  {/* Availability badge */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {isAvailable ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span
                        className={`font-mono-numbers text-[11px] font-medium ${
                          isAvailable ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isAvailable
                          ? `${book.availableCopies} Copies Available`
                          : 'All Copies Issued'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono-numbers">
                      {book.shelfLocation}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectBook(book)}
                      className="flex-1 py-1.5 px-3 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuthModal();
                        } else {
                          onRequestBorrow(book);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        isAvailable
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                          : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      {currentUser?.role === 'ROLE_ADMIN' ? 'Issue' : 'Borrow'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title & Author</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Available / Total</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div
                          onClick={() => onSelectBook(book)}
                          className="font-medium text-slate-100 hover:text-amber-300 cursor-pointer"
                        >
                          {book.title}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {book.author} ({book.publicationYear})
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono-numbers text-slate-400">
                        {book.isbn}
                      </td>
                      <td className="py-3 px-4 text-amber-400/90 font-medium">
                        {book.categoryName}
                      </td>
                      <td className="py-3 px-4 text-center font-mono-numbers">
                        <span
                          className={`font-semibold ${
                            isAvailable ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {book.availableCopies}
                        </span>
                        <span className="text-slate-500"> / {book.numberOfCopies}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {book.shelfLocation}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onSelectBook(book)}
                            className="px-2.5 py-1 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded text-[11px]"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              if (!currentUser) onOpenAuthModal();
                              else onRequestBorrow(book);
                            }}
                            disabled={!isAvailable}
                            className={`px-3 py-1 text-[11px] font-semibold rounded ${
                              isAvailable
                                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {currentUser?.role === 'ROLE_ADMIN' ? 'Issue' : 'Borrow'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
