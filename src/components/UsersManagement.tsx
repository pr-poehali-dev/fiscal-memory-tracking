import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

interface UsersManagementProps {
  userRole: 'admin' | 'manager' | 'viewer';
}

const UsersManagement = ({ userRole }: UsersManagementProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { 
          label: 'Администратор', 
          className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
          description: 'Полный доступ ко всем функциям'
        };
      case 'manager':
        return { 
          label: 'Менеджер', 
          className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          description: 'Управление данными и отчетами'
        };
      case 'viewer':
        return { 
          label: 'Просмотр', 
          className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
          description: 'Только чтение информации'
        };
      default:
        return { 
          label: 'Неизвестно', 
          className: 'bg-gray-300 text-gray-700',
          description: ''
        };
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const canEdit = userRole === 'admin';

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    manager: users.filter(u => u.role === 'manager').length,
    viewer: users.filter(u => u.role === 'viewer').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700">{roleStats.admin}</div>
                <div className="text-sm text-purple-600">Администраторов</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Icon name="UserCog" className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{roleStats.manager}</div>
                <div className="text-sm text-blue-600">Менеджеров</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <Icon name="Eye" className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-700">{roleStats.viewer}</div>
                <div className="text-sm text-gray-600">Просмотр</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" className="text-primary" />
              Управление пользователями
            </CardTitle>
            {canEdit && (
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Добавить пользователя
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <TableHead className="font-bold">Пользователь</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Роль</TableHead>
                  <TableHead className="font-bold">Последняя активность</TableHead>
                  <TableHead className="font-bold">Статус</TableHead>
                  {canEdit && <TableHead className="font-bold">Действия</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-purple-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleInfo(user.role).className}>
                        {getRoleInfo(user.role).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm">{user.status === 'online' ? 'Онлайн' : 'Оффлайн'}</span>
                      </div>
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Icon name="Pencil" size={14} />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!canEdit && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <Icon name="AlertTriangle" className="text-yellow-600 mt-0.5" size={20} />
              <div className="text-sm text-yellow-800">
                <span className="font-semibold">Ограниченный доступ:</span> Только администраторы могут управлять пользователями
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;