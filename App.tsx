
import React, { useState, createContext, useContext } from 'react';
import { AppTab } from './types';
import BottomNav from './components/BottomNav';
import Home from './views/Home';
import Profile from './views/Profile';
import AddBean from './views/AddBean';
import RoasterList from './views/RoasterList';
import RoasterDetail from './views/RoasterDetail';
import RoasterAdmin from './views/RoasterAdmin';
import TastingNotes from './views/TastingNotes';
import Settings from './views/Settings';
import DataSync from './views/DataSync';
import ThemeSettings from './views/ThemeSettings';
import NotificationSettings from './views/NotificationSettings';
import OtherSettings from './views/OtherSettings';
import { UserProvider } from './contexts/UserContext';

type ViewType =
  | { type: 'tab'; tab: AppTab }
  | { type: 'addBean' }
  | { type: 'roasterList' }
  | { type: 'roasterDetail'; roasterId: string }
  | { type: 'roasterAdmin' }
  | { type: 'tastingNotes' }
  | { type: 'settings' }
  | { type: 'dataSync' }
  | { type: 'themeSettings' }
  | { type: 'notificationSettings' }
  | { type: 'otherSettings' };

interface NavigationContextType {
  navigateTo: (tab: AppTab) => void;
  goToAddBean: () => void;
  goToRoasterList: () => void;
  goToRoasterDetail: (roasterId: string) => void;
  goToRoasterAdmin: () => void;
  goToTastingNotes: () => void;
  goToSettings: () => void;
  goToDataSync: () => void;
  goToThemeSettings: () => void;
  goToNotificationSettings: () => void;
  goToOtherSettings: () => void;
  goBack: () => void;
  activeTab: AppTab;
  currentView: ViewType;
}

const NavigationContext = createContext<NavigationContextType>({
  navigateTo: () => {},
  goToAddBean: () => {},
  goToRoasterList: () => {},
  goToRoasterDetail: () => {},
  goToRoasterAdmin: () => {},
  goToTastingNotes: () => {},
  goToSettings: () => {},
  goToDataSync: () => {},
  goToThemeSettings: () => {},
  goToNotificationSettings: () => {},
  goToOtherSettings: () => {},
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

  const goToRoasterDetail = (roasterId: string) => {
    setViewStack(prev => [...prev, { type: 'roasterDetail', roasterId }]);
  };

  const goToRoasterAdmin = () => {
    setViewStack(prev => [...prev, { type: 'roasterAdmin' }]);
  };

  const goToTastingNotes = () => {
    setViewStack(prev => [...prev, { type: 'tastingNotes' }]);
  };

  const goToSettings = () => {
    setViewStack(prev => [...prev, { type: 'settings' }]);
  };

  const goToDataSync = () => {
    setViewStack(prev => [...prev, { type: 'dataSync' }]);
  };

  const goToThemeSettings = () => {
    setViewStack(prev => [...prev, { type: 'themeSettings' }]);
  };

  const goToNotificationSettings = () => {
    setViewStack(prev => [...prev, { type: 'notificationSettings' }]);
  };

  const goToOtherSettings = () => {
    setViewStack(prev => [...prev, { type: 'otherSettings' }]);
  };

  const goBack = () => {
    setViewStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'addBean':
        return <AddBean />;
      case 'roasterList':
        return <RoasterList onBack={goBack} onRoasterClick={(roaster) => goToRoasterDetail(roaster.id)} />;
      case 'roasterDetail':
        return (
          <RoasterDetail
            roasterId={currentView.roasterId}
            onBack={goBack}
            onAddTastingNote={(beanName) => {
              goToTastingNotes();
            }}
          />
        );
      case 'roasterAdmin':
        return <RoasterAdmin onBack={goBack} />;
      case 'tastingNotes':
        return <TastingNotes onBack={goBack} />;
      case 'settings':
        return <Settings onBack={goBack} />;
      case 'dataSync':
        return <DataSync onBack={goBack} />;
      case 'themeSettings':
        return <ThemeSettings onBack={goBack} />;
      case 'notificationSettings':
        return <NotificationSettings onBack={goBack} />;
      case 'otherSettings':
        return <OtherSettings onBack={goBack} />;
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
        goToRoasterDetail,
        goToRoasterAdmin,
        goToTastingNotes,
        goToSettings,
        goToDataSync,
        goToThemeSettings,
        goToNotificationSettings,
        goToOtherSettings,
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
