import { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface DataContextType {
  warehouse: number;
  setWarehouse: (value: number) => void;
  warehouseName: string;
  setWarehouseName: (value: string) => void;
  cartCount: number;
  setCartCount:  (value: number) => void;
  cartItems: any;
  setCartItems: (value: any) => void;
  favoriteItems: any;
  setFavoriteItems: (value: any) => void;
  favoriteCount: number;
  setFavoriteCount: (value: number) => void;
  itemInCart: any;
  setItemInCart: (value: any) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  products: any;
  setProducts: (value: any) => void;
  showSearchResult: boolean;
  setShowSearchResult: (value: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [warehouse, setWarehouse] = useState<number>(1);
  const [warehouseName, setWarehouseName] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState([])
  const [favoriteItems, setFavoriteItems] = useState([])
  const [favoriteCount, setFavoriteCount] = useState<number>(0)
  const [itemInCart, setItemInCart] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [products, setProducts] = useState([])
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false)

  return (
    <DataContext.Provider 
      value={{ 
        warehouse, 
        setWarehouse, 
        warehouseName, 
        setWarehouseName,
        cartCount,
        setCartCount,
        cartItems,
        setCartItems,
        favoriteItems,
        setFavoriteItems,
        favoriteCount,
        setFavoriteCount,
        itemInCart,
        setItemInCart,
        loading,
        setLoading,
        search,
        setSearch,
        products,
        setProducts,
        showSearchResult,
        setShowSearchResult
        }}
      >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
