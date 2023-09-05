import { createContext, useState } from 'react';

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
