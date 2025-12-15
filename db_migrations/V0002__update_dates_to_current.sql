-- Обновление дат фискальных накопителей на актуальные
UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '7 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-005678';

UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '10 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-001234';

UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '13 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-003456';

UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '21 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-009012';

UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '31 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-002345';

UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '67 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-006789';

UPDATE fiscal_devices SET 
  expiry_date = CURRENT_DATE + INTERVAL '85 days',
  updated_at = CURRENT_TIMESTAMP
WHERE device_id = 'ФН-004567';

-- Обновление дат ОФД на актуальные
UPDATE ofd_providers SET 
  expiry_date = CURRENT_DATE + INTERVAL '15 days',
  updated_at = CURRENT_TIMESTAMP
WHERE name = 'Такском';

UPDATE ofd_providers SET 
  expiry_date = CURRENT_DATE + INTERVAL '26 days',
  updated_at = CURRENT_TIMESTAMP
WHERE name = 'Контур';

UPDATE ofd_providers SET 
  expiry_date = CURRENT_DATE + INTERVAL '95 days',
  updated_at = CURRENT_TIMESTAMP
WHERE name = 'Первый ОФД';

UPDATE ofd_providers SET 
  expiry_date = CURRENT_DATE + INTERVAL '182 days',
  updated_at = CURRENT_TIMESTAMP
WHERE name = 'ОФД.ру';

UPDATE ofd_providers SET 
  expiry_date = CURRENT_DATE + INTERVAL '233 days',
  updated_at = CURRENT_TIMESTAMP
WHERE name = 'Тензор';
