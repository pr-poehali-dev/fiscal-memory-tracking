-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'viewer')),
    status VARCHAR(50) DEFAULT 'offline',
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы операторов фискальных данных (ОФД)
CREATE TABLE ofd_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы фискальных накопителей
CREATE TABLE fiscal_devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    ofd_provider_id INTEGER REFERENCES ofd_providers(id),
    expiry_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('billed', 'pending', 'not_required')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы истории импорта
CREATE TABLE import_history (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    records_count INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для ускорения поиска
CREATE INDEX idx_fiscal_devices_expiry ON fiscal_devices(expiry_date);
CREATE INDEX idx_fiscal_devices_status ON fiscal_devices(status);
CREATE INDEX idx_ofd_providers_expiry ON ofd_providers(expiry_date);
CREATE INDEX idx_users_email ON users(email);

-- Вставка тестовых пользователей
INSERT INTO users (name, email, role, status, last_active) VALUES
('Иванов Иван', 'ivanov@company.ru', 'admin', 'online', '2024-12-15 14:32:00'),
('Петрова Мария', 'petrova@company.ru', 'manager', 'offline', '2024-12-15 12:15:00'),
('Сидоров Петр', 'sidorov@company.ru', 'manager', 'online', '2024-12-15 13:45:00'),
('Кузнецова Анна', 'kuznetsova@company.ru', 'viewer', 'offline', '2024-12-14 18:20:00'),
('Смирнов Алексей', 'smirnov@company.ru', 'viewer', 'offline', '2024-12-15 10:05:00');

-- Вставка тестовых ОФД
INSERT INTO ofd_providers (name, contract_number, expiry_date, status) VALUES
('ОФД.ру', 'ДГ-2023-001', '2025-06-15', 'active'),
('Такском', 'ТК-2023-045', '2024-12-30', 'expiring'),
('Первый ОФД', 'ПО-2023-112', '2025-03-20', 'active'),
('Контур', 'КТ-2023-078', '2025-01-10', 'expiring'),
('Тензор', 'ТЗ-2023-034', '2025-08-05', 'active');

-- Вставка тестовых фискальных накопителей
INSERT INTO fiscal_devices (device_id, name, location, ofd_provider_id, expiry_date, status) VALUES
('ФН-001234', 'Касса 1 - Магазин Центр', 'г. Москва', 1, '2024-12-25', 'billed'),
('ФН-002345', 'Касса 2 - Магазин Запад', 'г. Санкт-Петербург', 2, '2025-01-15', 'pending'),
('ФН-003456', 'Касса 3 - Филиал Север', 'г. Казань', 3, '2024-12-28', 'billed'),
('ФН-004567', 'Касса 4 - Склад Центральный', 'г. Москва', 1, '2025-03-10', 'not_required'),
('ФН-005678', 'Касса 5 - Магазин Восток', 'г. Екатеринбург', 4, '2024-12-22', 'pending'),
('ФН-006789', 'Касса 6 - Филиал Юг', 'г. Краснодар', 2, '2025-02-20', 'billed'),
('ФН-009012', 'Касса 5 - Склад', 'г. Москва', 1, '2025-01-05', 'not_required');

-- Вставка истории импорта
INSERT INTO import_history (filename, user_id, records_count, status, imported_at) VALUES
('devices_november.xlsx', 1, 45, 'success', '2024-12-10 15:30:00'),
('ofd_contracts.xlsx', 2, 12, 'success', '2024-12-08 11:20:00'),
('devices_october.xlsx', 3, 38, 'success', '2024-11-28 09:45:00'),
('updates_devices.xlsx', 1, 22, 'warning', '2024-11-15 16:10:00');
