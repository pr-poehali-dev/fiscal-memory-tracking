import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    expiringSoon: 0,
    activeOfd: 0,
    billedCount: 0
  });
  const [expiringDevices, setExpiringDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getDashboard();
        setStats(data.stats);
        setExpiringDevices(data.expiringDevices);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const statsCards = [
    {
      title: 'Всего накопителей',
      value: stats.totalDevices.toString(),
      icon: 'HardDrive',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Истекает до 30 дней',
      value: stats.expiringSoon.toString(),
      icon: 'AlertTriangle',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Активных ОФД',
      value: stats.activeOfd.toString(),
      icon: 'Server',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Выставлено счетов',
      value: stats.billedCount.toString(),
      icon: 'FileText',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'billed':
        return { label: 'Счет выставлен', variant: 'default' as const, color: 'bg-green-500' };
      case 'pending':
        return { label: 'Ожидает', variant: 'secondary' as const, color: 'bg-yellow-500' };
      case 'not_required':
        return { label: 'Не требуется', variant: 'outline' as const, color: 'bg-gray-400' };
      default:
        return { label: 'Неизвестно', variant: 'outline' as const, color: 'bg-gray-400' };
    }
  };

  const getDaysColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 14) return 'text-orange-600';
    if (days <= 21) return 'text-yellow-600';
    return 'text-blue-600';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <Icon name="Loader2" className="animate-spin text-primary" size={32} />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card 
            key={index} 
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-primary/20 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon name={stat.icon as any} className="text-white" size={18} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" className="text-primary" />
              Статистика по срокам
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">До 7 дней</span>
                <span className="font-semibold text-red-600">18 устройств</span>
              </div>
              <Progress value={18} max={248} className="h-2 bg-red-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">7-30 дней</span>
                <span className="font-semibold text-orange-600">35 устройств</span>
              </div>
              <Progress value={35} max={248} className="h-2 bg-orange-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">30-90 дней</span>
                <span className="font-semibold text-yellow-600">62 устройства</span>
              </div>
              <Progress value={62} max={248} className="h-2 bg-yellow-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Более 90 дней</span>
                <span className="font-semibold text-green-600">133 устройства</span>
              </div>
              <Progress value={133} max={248} className="h-2 bg-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Clock" className="text-secondary" />
              Истекающие сроки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringDevices.map((device, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white to-purple-50/50 border hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{device.name}</div>
                    <div className="text-xs text-muted-foreground">{device.id}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-bold ${getDaysColor(device.daysLeft)}`}>
                      {device.daysLeft} дней
                    </div>
                    <Badge variant={getStatusInfo(device.status).variant} className="text-xs">
                      {getStatusInfo(device.status).label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;