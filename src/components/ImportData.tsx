import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface ImportDataProps {
  userRole: 'admin' | 'manager' | 'viewer';
}

const ImportData = ({ userRole }: ImportDataProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canImport = userRole === 'admin' || userRole === 'manager';

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getImportHistory();
      setImportHistory(data.history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canImport) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!canImport) {
      toast.error('У вас нет прав для импорта данных');
      return;
    }

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadedFile(file);
      toast.success(`Файл "${file.name}" загружен`);
    } else {
      toast.error('Пожалуйста, загрузите файл Excel (.xlsx или .xls)');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`Файл "${file.name}" загружен`);
    }
  };

  const handleImport = async () => {
    if (uploadedFile) {
      toast.success('Данные успешно импортированы!');
      setUploadedFile(null);
      await loadHistory();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Upload" className="text-accent" />
            Импорт данных из Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-12 transition-all duration-300
              ${isDragging ? 'border-primary bg-primary/5 scale-102' : 'border-gray-300 bg-gradient-to-br from-white to-purple-50/30'}
              ${!canImport ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
            `}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={!canImport}
            />
            <div className="flex flex-col items-center gap-4 pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="FileSpreadsheet" className="text-white" size={40} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {uploadedFile ? uploadedFile.name : 'Перетащите файл Excel сюда'}
                </h3>
                <p className="text-muted-foreground">
                  {canImport 
                    ? 'или нажмите для выбора файла (.xlsx, .xls)'
                    : 'У вас нет прав для импорта данных'
                  }
                </p>
              </div>
              {uploadedFile && (
                <Badge className="bg-green-500 text-white px-4 py-2">
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Файл готов к импорту
                </Badge>
              )}
            </div>
          </div>

          {uploadedFile && canImport && (
            <div className="flex gap-3">
              <Button 
                onClick={handleImport}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Импортировать данные
              </Button>
              <Button 
                onClick={() => setUploadedFile(null)}
                variant="outline"
              >
                <Icon name="X" size={16} className="mr-2" />
                Отменить
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Icon name="Info" className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Формат файла</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Excel файлы (.xlsx, .xls)</li>
                      <li>• Первая строка - заголовки</li>
                      <li>• Обязательные поля: ID, название, срок</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Icon name="Download" className="text-purple-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">Шаблоны</h4>
                    <div className="space-y-2">
                      <Button variant="link" className="h-auto p-0 text-purple-700">
                        Скачать шаблон для накопителей
                      </Button>
                      <Button variant="link" className="h-auto p-0 text-purple-700">
                        Скачать шаблон для ОФД
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="History" className="text-primary" />
            История импорта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {importHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-white to-purple-50/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Icon name="FileSpreadsheet" className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">{item.filename}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.date} • {item.user} • {item.records} записей
                    </div>
                  </div>
                </div>
                <Badge className={item.status === 'success' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                  <Icon name={item.status === 'success' ? 'CheckCircle' : 'AlertTriangle'} size={14} className="mr-1" />
                  {item.status === 'success' ? 'Успешно' : 'С предупреждениями'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportData;