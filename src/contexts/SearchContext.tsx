import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchResult {
  id: string;
  name: string;
  nameNe: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  descriptionNe: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  currentPage: 'home' | 'shop' | 'contact';
  setCurrentPage: (page: 'home' | 'shop' | 'contact') => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'contact'>('home');

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,
      isSearching,
      setIsSearching,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};