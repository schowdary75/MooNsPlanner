-- MooNs Application MySQL Database Schema DDL
-- Database: moons

CREATE DATABASE IF NOT EXISTS moons CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moons;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(191) NOT NULL UNIQUE,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  maps_api_key TEXT,
  unsplash_api_key TEXT,
  openweather_api_key TEXT,
  avatar VARCHAR(255),
  oidc_sub VARCHAR(255),
  oidc_issuer VARCHAR(255),
  last_login DATETIME,
  mfa_enabled TINYINT(1) DEFAULT 0,
  mfa_secret VARCHAR(255),
  mfa_backup_codes TEXT,
  immich_url VARCHAR(255),
  immich_access_token TEXT,
  synology_url VARCHAR(255),
  synology_username VARCHAR(255),
  synology_password VARCHAR(255),
  synology_sid VARCHAR(255),
  must_change_password TINYINT(1) DEFAULT 0,
  password_version INT NOT NULL DEFAULT 0,
  feed_token VARCHAR(255),
  is_guest TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(191) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  consumed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_ip VARCHAR(45),
  INDEX idx_prt_user (user_id),
  INDEX idx_prt_hash (token_hash),
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- WebAuthn Credentials
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  credential_id VARCHAR(255) NOT NULL UNIQUE,
  public_key BLOB NOT NULL,
  counter INT NOT NULL DEFAULT 0,
  transports VARCHAR(255),
  device_type VARCHAR(255),
  backed_up TINYINT(1) NOT NULL DEFAULT 0,
  name VARCHAR(255),
  aaguid VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME,
  INDEX idx_webauthn_credentials_user (user_id),
  CONSTRAINT fk_webauthn_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- WebAuthn Challenges
CREATE TABLE IF NOT EXISTS webauthn_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  challenge VARCHAR(255) NOT NULL UNIQUE,
  user_id INT,
  type VARCHAR(50) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_webauthn_challenges_expires (expires_at),
  CONSTRAINT fk_webauthn_challenge_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  value TEXT,
  UNIQUE KEY unique_user_key (user_id, `key`),
  CONSTRAINT fk_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date VARCHAR(50),
  end_date VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'EUR',
  cover_image VARCHAR(255),
  is_archived TINYINT(1) DEFAULT 0,
  reminder_days INT DEFAULT 3,
  feed_token VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Days
CREATE TABLE IF NOT EXISTS days (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  day_number INT NOT NULL,
  date VARCHAR(50),
  notes TEXT,
  title VARCHAR(255),
  UNIQUE KEY unique_trip_day (trip_id, day_number),
  CONSTRAINT fk_days_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50) DEFAULT '#6366f1',
  icon VARCHAR(50) DEFAULT '📍',
  user_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50) DEFAULT '#10b981',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tags_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Places
CREATE TABLE IF NOT EXISTS places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  lat DOUBLE,
  lng DOUBLE,
  address TEXT,
  category_id INT,
  price DOUBLE,
  currency VARCHAR(10),
  reservation_status VARCHAR(50) DEFAULT 'none',
  reservation_notes TEXT,
  reservation_datetime VARCHAR(50),
  place_time VARCHAR(50),
  end_time VARCHAR(50),
  duration_minutes INT DEFAULT 60,
  notes TEXT,
  image_url TEXT,
  google_place_id VARCHAR(255),
  google_ftid VARCHAR(255),
  website TEXT,
  phone VARCHAR(50),
  transport_mode VARCHAR(50) DEFAULT 'walking',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_places_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT fk_places_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Place Tags
CREATE TABLE IF NOT EXISTS place_tags (
  place_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (place_id, tag_id),
  CONSTRAINT fk_pt_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT fk_pt_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Day Assignments
CREATE TABLE IF NOT EXISTS day_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_id INT NOT NULL,
  place_id INT NOT NULL,
  order_index INT DEFAULT 0,
  notes TEXT,
  reservation_status VARCHAR(50) DEFAULT 'none',
  reservation_notes TEXT,
  reservation_datetime VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_da_day FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE,
  CONSTRAINT fk_da_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Packing Items
CREATE TABLE IF NOT EXISTS packing_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  checked TINYINT(1) DEFAULT 0,
  category VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_packing_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Photos
CREATE TABLE IF NOT EXISTS photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  day_id INT,
  place_id INT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  caption TEXT,
  taken_at VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_photos_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT fk_photos_day FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE SET NULL,
  CONSTRAINT fk_photos_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
