const API_URL = 'https://functions.poehali.dev/7f728a36-9f24-4747-bb2a-55f9efc0a436';

export const api = {
  async getDashboard() {
    const response = await fetch(`${API_URL}?endpoint=dashboard`);
    return response.json();
  },

  async getDevices(search = '', status = 'all') {
    const params = new URLSearchParams({ endpoint: 'devices' });
    if (search) params.append('search', search);
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}?${params}`);
    return response.json();
  },

  async getOFD() {
    const response = await fetch(`${API_URL}?endpoint=ofd`);
    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_URL}?endpoint=users`);
    return response.json();
  },

  async getImportHistory() {
    const response = await fetch(`${API_URL}?endpoint=import_history`);
    return response.json();
  },

  async updateDeviceStatus(deviceId: string, status: string) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_device_status',
        device_id: deviceId,
        status
      })
    });
    return response.json();
  },

  async addDevice(device: any) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_device',
        ...device
      })
    });
    return response.json();
  }
};
