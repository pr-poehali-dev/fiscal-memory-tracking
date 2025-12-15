import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)

def calculate_days_left(expiry_date_str: str) -> int:
    expiry_date = datetime.strptime(expiry_date_str, '%Y-%m-%d')
    today = datetime.now()
    return (expiry_date - today).days

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления системой учета фискальных накопителей
    Args: event - HTTP запрос с методом и путем
          context - контекст выполнения функции
    Returns: HTTP ответ с данными
    '''
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {})
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            endpoint = query_params.get('endpoint', 'dashboard')
            
            if endpoint == 'dashboard':
                cur.execute("SELECT COUNT(*) as total FROM fiscal_devices")
                total_devices = cur.fetchone()['total']
                
                cur.execute("""
                    SELECT COUNT(*) as expiring 
                    FROM fiscal_devices 
                    WHERE expiry_date <= CURRENT_DATE + INTERVAL '30 days'
                """)
                expiring_soon = cur.fetchone()['expiring']
                
                cur.execute("SELECT COUNT(*) as total FROM ofd_providers WHERE status = 'active'")
                active_ofd = cur.fetchone()['total']
                
                cur.execute("SELECT COUNT(*) as billed FROM fiscal_devices WHERE status = 'billed'")
                billed_count = cur.fetchone()['billed']
                
                cur.execute("""
                    SELECT fd.device_id, fd.name, fd.expiry_date, fd.status, op.name as ofd_name
                    FROM fiscal_devices fd
                    LEFT JOIN ofd_providers op ON fd.ofd_provider_id = op.id
                    WHERE fd.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
                    ORDER BY fd.expiry_date ASC
                    LIMIT 4
                """)
                expiring_devices = []
                for row in cur.fetchall():
                    expiring_devices.append({
                        'id': row['device_id'],
                        'name': row['name'],
                        'daysLeft': calculate_days_left(str(row['expiry_date'])),
                        'status': row['status']
                    })
                
                result = {
                    'stats': {
                        'totalDevices': total_devices,
                        'expiringSoon': expiring_soon,
                        'activeOfd': active_ofd,
                        'billedCount': billed_count
                    },
                    'expiringDevices': expiring_devices
                }
                
            elif endpoint == 'devices':
                search = query_params.get('search', '')
                status_filter = query_params.get('status', 'all')
                
                query = """
                    SELECT fd.*, op.name as ofd_name
                    FROM fiscal_devices fd
                    LEFT JOIN ofd_providers op ON fd.ofd_provider_id = op.id
                    WHERE 1=1
                """
                
                if search:
                    query += f" AND (fd.name ILIKE '%{search}%' OR fd.device_id ILIKE '%{search}%' OR fd.location ILIKE '%{search}%')"
                
                if status_filter != 'all':
                    query += f" AND fd.status = '{status_filter}'"
                
                query += " ORDER BY fd.expiry_date ASC"
                
                cur.execute(query)
                devices = []
                for row in cur.fetchall():
                    devices.append({
                        'id': row['device_id'],
                        'name': row['name'],
                        'location': row['location'],
                        'ofd': row['ofd_name'],
                        'expiryDate': str(row['expiry_date']),
                        'daysLeft': calculate_days_left(str(row['expiry_date'])),
                        'status': row['status']
                    })
                
                result = {'devices': devices}
                
            elif endpoint == 'ofd':
                cur.execute("""
                    SELECT op.*, 
                           (SELECT COUNT(*) FROM fiscal_devices WHERE ofd_provider_id = op.id) as devices_count
                    FROM ofd_providers op
                    ORDER BY op.expiry_date ASC
                """)
                providers = []
                for row in cur.fetchall():
                    providers.append({
                        'id': row['id'],
                        'name': row['name'],
                        'contractNumber': row['contract_number'],
                        'expiryDate': str(row['expiry_date']),
                        'daysLeft': calculate_days_left(str(row['expiry_date'])),
                        'devicesCount': row['devices_count'],
                        'status': row['status']
                    })
                
                result = {'providers': providers}
                
            elif endpoint == 'users':
                cur.execute("SELECT * FROM users ORDER BY id ASC")
                users = []
                for row in cur.fetchall():
                    users.append({
                        'id': row['id'],
                        'name': row['name'],
                        'email': row['email'],
                        'role': row['role'],
                        'status': row['status'],
                        'lastActive': str(row['last_active'])
                    })
                
                result = {'users': users}
                
            elif endpoint == 'import_history':
                cur.execute("""
                    SELECT ih.*, u.name as user_name
                    FROM import_history ih
                    LEFT JOIN users u ON ih.user_id = u.id
                    ORDER BY ih.imported_at DESC
                    LIMIT 10
                """)
                history = []
                for row in cur.fetchall():
                    history.append({
                        'id': row['id'],
                        'filename': row['filename'],
                        'date': str(row['imported_at']),
                        'user': row['user_name'],
                        'records': row['records_count'],
                        'status': row['status']
                    })
                
                result = {'history': history}
            
            else:
                result = {'error': 'Unknown endpoint'}
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'update_device_status':
                device_id = body.get('device_id')
                new_status = body.get('status')
                
                cur.execute(
                    "UPDATE fiscal_devices SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE device_id = %s",
                    (new_status, device_id)
                )
                conn.commit()
                result = {'success': True, 'message': 'Статус обновлен'}
            
            elif action == 'add_device':
                cur.execute("""
                    INSERT INTO fiscal_devices (device_id, name, location, ofd_provider_id, expiry_date, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    body['device_id'],
                    body['name'],
                    body.get('location', ''),
                    body.get('ofd_provider_id'),
                    body['expiry_date'],
                    body.get('status', 'pending')
                ))
                conn.commit()
                result = {'success': True, 'message': 'Устройство добавлено'}
            
            else:
                result = {'error': 'Unknown action'}
        
        else:
            result = {'error': 'Method not allowed'}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }
