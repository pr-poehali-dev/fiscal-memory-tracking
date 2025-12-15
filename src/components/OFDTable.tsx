import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface OFDTableProps {
  userRole: 'admin' | 'manager' | 'viewer';
}

const OFDTable = ({ userRole }: OFDTableProps) => {
  const ofdProviders = [
    { 
      id: 1, 
      name: 'ОФД.ру', 
      contractNumber: 'ДГ-2023-001', 
      expiryDate: '2025-06-15', 
      daysLeft: 182,
      devicesCount: 87,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Такском', 
      contractNumber: 'ТК-2023-045', 
      expiryDate: '2024-12-30', 
      daysLeft: 15,
      devicesCount: 64,
      status: 'expiring'
    },
    { 
      id: 3, 
      name: 'Первый ОФД', 
      contractNumber: 'ПО-2023-112', 
      expiryDate: '2025-03-20', 
      daysLeft: 95,
      devicesCount: 52,
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Контур', 
      contractNumber: 'КТ-2023-078', 
      expiryDate: '2025-01-10', 
      daysLeft: 26,
      devicesCount: 35,
      status: 'expiring'
    },
    { 
      id: 5, 
      name: 'Тензор', 
      contractNumber: 'ТЗ-2023-034', 
      expiryDate: '2025-08-05', 
      daysLeft: 233,
      devicesCount: 10,
      status: 'active'
    },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Активен', className: 'bg-green-500 text-white' };
      case 'expiring':
        return { label: 'Истекает', className: 'bg-orange-500 text-white' };
      case 'expired':
        return { label: 'Истек', className: 'bg-red-500 text-white' };
      default:
        return { label: 'Неизвестно', className: 'bg-gray-400 text-white' };
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 30) return 'text-red-600 font-bold';
    if (days <= 60) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  const canEdit = userRole === 'admin' || userRole === 'manager';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Server" className="text-secondary" />
            Операторы фискальных данных (ОФД)
          </CardTitle>
          {canEdit && (
            <Button className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-opacity">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить ОФД
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">3</div>
                  <div className="text-sm text-green-600">Активных контрактов</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Icon name="AlertTriangle" className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700">2</div>
                  <div className="text-sm text-orange-600">Истекает скоро</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Icon name="HardDrive" className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">248</div>
                  <div className="text-sm text-blue-600">Всего устройств</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-pink-50 to-purple-50">
                <TableHead className="font-bold">ОФД</TableHead>
                <TableHead className="font-bold">Номер договора</TableHead>
                <TableHead className="font-bold">Срок действия</TableHead>
                <TableHead className="font-bold">Осталось дней</TableHead>
                <TableHead className="font-bold">Устройств</TableHead>
                <TableHead className="font-bold">Статус</TableHead>
                {canEdit && <TableHead className="font-bold">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ofdProviders.map((provider) => (
                <TableRow key={provider.id} className="hover:bg-pink-50/50 transition-colors">
                  <TableCell className="font-semibold text-base">{provider.name}</TableCell>
                  <TableCell className="font-mono text-sm">{provider.contractNumber}</TableCell>
                  <TableCell>{provider.expiryDate}</TableCell>
                  <TableCell className={getDaysLeftColor(provider.daysLeft)}>
                    {provider.daysLeft} дней
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {provider.devicesCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusInfo(provider.status).className}>
                      {getStatusInfo(provider.status).label}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Icon name="Pencil" size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Icon name="Eye" size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OFDTable;
