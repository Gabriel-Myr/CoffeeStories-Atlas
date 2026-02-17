
import React, { useState, createContext, useContext } from 'react';
import { AppTab } from './types';
import BottomNav from './components/BottomNav';
import Home from './views/Home';
import Profile from './views/Profile';
import AddBean from './views/AddBean';
import RoasterList from './views/RoasterList';
import RoasterAdmin from './views/RoasterAdmin';
import { UserProvider } from './contexts/UserContext';

type ViewType =
  | { type: 'tab'; tab: AppTab }
  | { type: 'addBean' }
  | { type: 'roasterList' }
  | { type: 'roasterAdmin' };

interface NavigationContextType {
  navigateTo: (tab: AppTab) => void;
  goToAddBean: () => void;
  goToRoasterList: () => void;
  goToRoasterAdmin: () => void;
  goBack: () => void;
  activeTab: AppTab;
  currentView: ViewType;
}

const NavigationContext = createContext<NavigationContextType>({
  navigateTo: () => {},
  goToAddBean: () => {},
  goToRoasterList: () => {},
  goToRoasterAdmin: () => {},
  goBack: () => {},
  activeTab: AppTab.HOME,
  currentView: { type: 'tab', tab: AppTab.HOME }
});

export const useNavigation = () => useContext(NavigationContext);

const App: React.FC = () => {
  const [viewStack, setViewStack] = useState<ViewType[]>([{ type: 'tab', tab: AppTab.HOME }]);
  
  const currentView = viewStack[viewStack.length - 1];
  const activeTab = currentView.type === 'tab' ? currentView.tab : AppTab.HOME;

  const navigateTo = (tab: AppTab) => {
    setViewStack([{ type: 'tab', tab }]);
  };

  const goToAddBean = () => {
    setViewStack(prev => [...prev, { type: 'addBean' }]);
  };

  const goToRoasterList = () => {
    setViewStack(prev => [...prev, { type: 'roasterList' }]);
  };

  const goToRoasterAdmin = () => {
    setViewStack(prev => [...prev, { type: 'roasterAdmin' }]);
  };

  const goBack = () => {
    setViewStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'addBean':
        return <AddBean />;
      case 'roasterList':
        return <RoasterList onBack={goBack} />;
      case 'roasterAdmin':
        return <RoasterAdmin onBack={goBack} />;
      case 'tab':
        switch (currentView.tab) {
          case AppTab.HOME:
            return <Home onAddBean={goToAddBean} />;
          case AppTab.PROFILE:
            return <Profile />;
          default:
            return <Home onAddBean={goToAddBean} />;
        }
      default:
        return <Home onAddBean={goToAddBean} />;
    }
  };

  const showBottomNav = currentView.type === 'tab';

  return (
    <UserProvider>
      <NavigationContext.Provider value={{
        navigateTo,
        goToAddBean,
        goToRoasterList,
        goToRoasterAdmin,
        goBack,
        activeTab,
        currentView
      }}>
      <div className="flex flex-col h-screen max-h-screen">
        <main className="flex-1 min-h-0 overflow-y-auto bg-white">
          {renderContent()}
        </main>
        {showBottomNav && <BottomNav activeTab={activeTab} onTabChange={navigateTo} />}
      </div>
    </NavigationContext.Provider>
    </UserProvider>
  );
};

export default App;
