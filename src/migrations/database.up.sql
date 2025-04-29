CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS tenant;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS canteen;

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
    image_url VARCHAR(50) NULL,
    
    FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE
);