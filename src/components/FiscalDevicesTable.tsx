import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface FiscalDevicesTableProps {
  userRole: 'admin' | 'manager' | 'viewer';
}

const FiscalDevicesTable = ({ userRole }: FiscalDevicesTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, [searchTerm, statusFilter]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await api.getDevices(searchTerm, statusFilter);
      setDevices(data.devices);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'billed':
        return { label: 'Счет выставлен', className: 'bg-green-500 text-white hover:bg-green-600' };
      case 'pending':
        return { label: 'Ожидает', className: 'bg-yellow-500 text-white hover:bg-yellow-600' };
      case 'not_required':
        return { label: 'Не требуется', className: 'bg-gray-400 text-white hover:bg-gray-500' };
      default:
        return { label: 'Неизвестно', className: 'bg-gray-300 text-gray-700' };
    }
  };

  const getDaysLeftBadge = (days: number) => {
    if (days <= 7) return 'bg-red-500 text-white';
    if (days <= 14) return 'bg-orange-500 text-white';
    if (days <= 30) return 'bg-yellow-500 text-white';
    return 'bg-blue-500 text-white';
  };

  const canEdit = userRole === 'admin' || userRole === 'manager';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Icon name="HardDrive" className="text-primary" />
            Фискальные накопители
          </CardTitle>
          {canEdit && (
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить накопитель
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Поиск по названию, ID или локации..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="billed">Счет выставлен</SelectItem>
              <SelectItem value="pending">Ожидает</SelectItem>
              <SelectItem value="not_required">Не требуется</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Название</TableHead>
                <TableHead className="font-bold">Локация</TableHead>
                <TableHead className="font-bold">ОФД</TableHead>
                <TableHead className="font-bold">Срок истечения</TableHead>
                <TableHead className="font-bold">Осталось дней</TableHead>
                <TableHead className="font-bold">Статус</TableHead>
                {canEdit && <TableHead className="font-bold">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Icon name="Loader2" className="animate-spin text-primary mx-auto" size={32} />
                  </TableCell>
                </TableRow>
              ) : devices.map((device, index) => (
                <TableRow key={index} className="hover:bg-purple-50/50 transition-colors">
                  <TableCell className="font-mono text-sm">{device.id}</TableCell>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell className="text-muted-foreground">{device.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{device.ofd}</Badge>
                  </TableCell>
                  <TableCell>{device.expiryDate}</TableCell>
                  <TableCell>
                    <Badge className={getDaysLeftBadge(device.daysLeft)}>
                      {device.daysLeft} дней
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusInfo(device.status).className}>
                      {getStatusInfo(device.status).label}
                    </Badge>
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

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Показано {devices.length} записей</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiscalDevicesTable;