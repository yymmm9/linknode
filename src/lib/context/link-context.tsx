import React, { createContext, useContext, useState } from 'react';
import type { ExtraLinkProps, DataProps } from '@/types';

interface DataContextType {
  data: DataProps;
  setData: (data: DataProps) => void;
  addNewData: (linkData: ExtraLinkProps) => void;
  updateIndex: (updatedIndex: ExtraLinkProps[]) => void;
  updateProfileInfo: (name: string, value: string) => void;
  updateSocialInfo: (name: string, value: string) => void;
  updateAdditionalInfo: (updatedIndex: ExtraLinkProps[]) => void;
  showDemo: () => void;
  selectBackground: (bgcode: string) => void;
}

const initialData: DataProps = {
  n: '',
  i: '',
  d: '',
  f: '',
  t: '',
  ig: '',
  tg: '',
  gh: '',
  l: '',
  e: '',
  w: '',
  y: '',
  bg: '',
  ls: [],
};

const demoData: DataProps = {
  n: 'Carlos',
  ln: 'Garcia',
  addr: 'Madrid, Spain',
  i: '',
  d: "",
  f: 'https://www.facebook.com/',
  t: 'https://twitter.com/',
  ig: 'https://www.instagram.com/',
  tg: '',
  gh: '',
  l: 'https://linkedin.com/',
  e: 'mail@example.com',
  w: '+34 123 4567 890',
  y: 'https://youtube.com/',
  bg: '#4F4F4F',
  ti: 'Ovethinker',
  o: 'Company Inc.',
  // r: 'Full Stack Developer',
  ls: [
    {
      id: 1,
      i: 'ph:laptop-duotone',
      l: 'Latest Project',
      u: 'example.com',
    },
    {
      id: 2,
      i: 'ant-design:robot-outlined',
      l: 'Customer Support',
      u: 'example.com/chatbot',
    },
    {
      id: 3,
      i: 'fluent:brain-circuit-20-regular',
      l: '2024 Report',
      u: 'example.com/ml',
    },
  ],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<DataProps>(initialData);

  const selectBackground = (bgcode: string) => {
    setData((prevState) => ({
      ...prevState,
      bg: bgcode,
    }));
  };

  const addNewData = (linkData: ExtraLinkProps) => {
    setData((prevData) => ({
      ...prevData,
      ls: [...prevData.ls, linkData],
    }));
  };

  const updateIndex = (updatedIndex: ExtraLinkProps[]) => {
    setData((prevState) => ({
      ...prevState,
      ls: updatedIndex,
    }));
  };

  const updateAdditionalInfo = (updatedIndex: ExtraLinkProps[]) => {
    setData((prevState) => ({
      ...prevState,
      ls: updatedIndex,
    }));
  };

  const updateProfileInfo = (name: string, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateSocialInfo = (name: string, value: string) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showDemo = () => {
    setData(demoData);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        addNewData,
        updateIndex,
        updateProfileInfo,
        updateSocialInfo,
        updateAdditionalInfo,
        showDemo,
        selectBackground,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
