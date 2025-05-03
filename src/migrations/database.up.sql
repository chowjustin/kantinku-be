CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS tenant;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS canteen;
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_item;
DROP TYPE IF EXISTS status_order;
DROP TYPE IF EXISTS status_payment;

CREATE TYPE status_order AS ENUM ('Menunggu', 'Diproses', 'Ditolak', 'Siap Diambil', 'Selesai');
CREATE TYPE status_payment AS ENUM ('capture', 'settlement', 'pending', 'deny', 'cancel', 'expire', 'failure', 'refund', 'partial_refund', 'authorize');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(80) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    nomor_telepon VARCHAR(20) NOT NULL,
    password CHAR(60) NOT NULL,
    nrp VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE canteen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departement VARCHAR(100) NOT NULL,
    nama VARCHAR(80) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canteen_id UUID,
    nama VARCHAR(80) NOT NULL,
    nama_tenant VARCHAR(80) NOT NULL,
    password CHAR(60) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    nomor_telepon VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (canteen_id) REFERENCES canteen(id) ON DELETE CASCADE
);

CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    nama VARCHAR(80) NOT NULL,
    deskripsi TEXT NOT NULL,
    harga INTEGER NOT NULL,
    stok INTEGER NOT NULL,
    image_url TEXT NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    order_status status_order NOT NULL DEFAULT 'Menunggu',
    payment_status status_payment NOT NULL DEFAULT 'Unpaid',
    token VARCHAR(255),
    expires_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE order_item (
    order_id INTEGER NOT NULL,
    menu_id UUID NOT NULL,
    quantity INTEGER NOT NULL,

    PRIMARY KEY (order_id, menu_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);