
import React, { useState, createContext, useContext } from 'react';
import { AppTab } from './types';
import BottomNav from './components/BottomNav';
import Home from './views/Home';
import Circle from './views/Circle';
import Messages from './views/Messages';
import Profile from './views/Profile';
import AddBean from './views/AddBean';

interface NavigationContextType {
  navigateTo: (tab: AppTab) => void;
  goToAddBean: () => void;
  activeTab: AppTab;
}

const NavigationContext = createContext<NavigationContextType>({
  navigateTo: () => {},
  goToAddBean: () => {},
  activeTab: AppTab.HOME
});

export const useNavigation = () => useContext(NavigationContext);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showAddBean, setShowAddBean] = useState(false);

  const navigateTo = (tab: AppTab) => {
    setActiveTab(tab);
    setShowAddBean(false);
  };

  const goToAddBean = () => {
    setShowAddBean(true);
  };

  const renderContent = () => {
    if (showAddBean) {
      return <AddBean />;
    }
    
    switch (activeTab) {
      case AppTab.HOME:
        return <Home onAddBean={goToAddBean} />;
      case AppTab.CIRCLE:
        return <Circle />;
      case AppTab.MESSAGES:
        return <Messages />;
      case AppTab.PROFILE:
        return <Profile />;
      default:
        return <Home onAddBean={goToAddBean} />;
    }
  };

  return (
    <NavigationContext.Provider value={{ navigateTo, goToAddBean, activeTab }}>
      <div className="flex flex-col h-screen max-h-screen">
        <main className="flex-1 overflow-y-auto bg-white">
          {renderContent()}
        </main>
        {!showAddBean && <BottomNav activeTab={activeTab} onTabChange={navigateTo} />}
      </div>
    </NavigationContext.Provider>
  );
};

export default App;
