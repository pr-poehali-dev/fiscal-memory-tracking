import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Dashboard from '@/components/Dashboard';
import FiscalDevicesTable from '@/components/FiscalDevicesTable';
import OFDTable from '@/components/OFDTable';
import UsersManagement from '@/components/UsersManagement';
import ImportData from '@/components/ImportData';

type UserRole = 'admin' | 'manager' | 'viewer';

const Index = () => {
  const [currentUser] = useState<UserRole>('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-pink-50/30">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Icon name="Database" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ФискалКонтроль
              </h1>
              <p className="text-xs text-muted-foreground">Учет фискальных накопителей</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white">
              <Icon name="User" size={14} className="mr-1" />
              {currentUser === 'admin' ? 'Администратор' : currentUser === 'manager' ? 'Менеджер' : 'Просмотр'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto bg-white shadow-md h-auto p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Панель</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
              <Icon name="HardDrive" size={16} />
              <span className="hidden sm:inline">Накопители</span>
            </TabsTrigger>
            <TabsTrigger value="ofd" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
              <Icon name="Server" size={16} />
              <span className="hidden sm:inline">ОФД</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
              <Icon name="Upload" size={16} />
              <span className="hidden sm:inline">Импорт</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="animate-fade-in">
            <Dashboard />
          </TabsContent>

          <TabsContent value="devices" className="animate-fade-in">
            <FiscalDevicesTable userRole={currentUser} />
          </TabsContent>

          <TabsContent value="ofd" className="animate-fade-in">
            <OFDTable userRole={currentUser} />
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in">
            <UsersManagement userRole={currentUser} />
          </TabsContent>

          <TabsContent value="import" className="animate-fade-in">
            <ImportData userRole={currentUser} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
