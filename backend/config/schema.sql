-- MedBook Database Schema
CREATE DATABASE IF NOT EXISTS medbook;
USE medbook;

-- Users table (patients, doctors, admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
  phone VARCHAR(20),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  image VARCHAR(500),
  description TEXT,
  rating DECIMAL(2,1) DEFAULT 4.0,
  total_doctors INT DEFAULT 0,
  specialties JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  hospital_id INT,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience INT DEFAULT 0,
  qualification VARCHAR(500),
  bio TEXT,
  avatar VARCHAR(500),
  rating DECIMAL(2,1) DEFAULT 4.0,
  consultation_fee DECIMAL(10,2) DEFAULT 500.00,
  available_days JSON,
  available_slots JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  hospital_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('appointment', 'payment', 'system', 'reminder') DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Seed Data
-- Admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@medbook.com', '$2a$10$rQEKkNFmhb0PfBKEMfXf4.5jvXCfGLJYFJHH8nEWO3JHFdYrYg8mK', 'admin');

-- Sample hospitals
INSERT IGNORE INTO hospitals (name, address, city, phone, email, description, rating, total_doctors, specialties) VALUES
('Bir Hospital', 'Mahaboudha, Kathmandu', 'Kathmandu', '01-4221988', 'info@birhospital.gov.np', 'One of the oldest and largest government hospitals in Nepal providing comprehensive medical care.', 4.2, 45, '["Cardiology","Neurology","Orthopedics","Pediatrics","General Surgery"]'),
('Patan Hospital', 'Lagankhel, Lalitpur', 'Lalitpur', '01-5522278', 'info@patanhospital.org', 'A leading non-profit hospital known for its community-focused healthcare services.', 4.5, 38, '["Internal Medicine","Gynecology","Dermatology","ENT","Ophthalmology"]'),
('Grande International Hospital', 'Dhapasi, Kathmandu', 'Kathmandu', '01-5159266', 'info@grande.com.np', 'A state-of-the-art multi-specialty hospital with cutting-edge technology.', 4.7, 62, '["Oncology","Cardiology","Neurosurgery","Transplant","Plastic Surgery"]'),
('Teaching Hospital', 'Maharajgunj, Kathmandu', 'Kathmandu', '01-4412303', 'info@iom.edu.np', 'Institute of Medicine teaching hospital providing quality medical education and care.', 4.3, 55, '["All Specialties","Research","Emergency Medicine"]'),
('Norvic International Hospital', 'Thapathali, Kathmandu', 'Kathmandu', '01-4258554', 'info@norvic.com.np', 'Premium private hospital offering international standard healthcare services.', 4.6, 40, '["Cardiac Surgery","IVF","Bariatric Surgery","Robotic Surgery"]');

-- Sample doctors
INSERT IGNORE INTO doctors (hospital_id, name, specialization, experience, qualification, bio, rating, consultation_fee, available_days, available_slots) VALUES
(1, 'Dr. Rajesh Sharma', 'Cardiologist', 15, 'MBBS, MD Cardiology', 'Senior cardiologist with expertise in interventional cardiology and heart failure management.', 4.8, 1500, '["Monday","Tuesday","Wednesday","Thursday","Friday"]', '["09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00","15:30","16:00"]'),
(1, 'Dr. Sushila Karki', 'Neurologist', 12, 'MBBS, MD Neurology, DM', 'Expert in treating neurological disorders including epilepsy, stroke and Parkinson disease.', 4.6, 1200, '["Monday","Wednesday","Friday"]', '["10:00","10:30","11:00","11:30","15:00","15:30","16:00"]'),
(2, 'Dr. Binod Thapa', 'Orthopedic Surgeon', 18, 'MBBS, MS Orthopedics', 'Specialized in joint replacement, sports injuries and spine surgery.', 4.7, 1800, '["Tuesday","Thursday","Saturday"]', '["09:00","09:30","10:00","11:00","14:00","15:00","16:00"]'),
(2, 'Dr. Anita Pradhan', 'Gynecologist', 10, 'MBBS, MD OBG', 'Experienced gynecologist specializing in high-risk pregnancies and laparoscopic surgery.', 4.9, 1000, '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]', '["08:00","08:30","09:00","09:30","10:00","14:00","14:30","15:00"]'),
(3, 'Dr. Subash Acharya', 'Oncologist', 20, 'MBBS, MD Oncology, PhD', 'Pioneer in cancer treatment using latest chemotherapy and immunotherapy protocols.', 4.8, 2500, '["Monday","Wednesday","Thursday"]', '["10:00","11:00","14:00","15:00","16:00"]'),
(3, 'Dr. Priya Joshi', 'Dermatologist', 8, 'MBBS, MD Dermatology', 'Expert in skin disorders, cosmetic dermatology and trichology.', 4.5, 800, '["Monday","Tuesday","Thursday","Friday"]', '["09:00","09:30","10:00","10:30","11:00","11:30","16:00","16:30"]'),
(4, 'Dr. Nabin Gautam', 'Pediatrician', 14, 'MBBS, MD Pediatrics', 'Child health specialist with focus on neonatal care and pediatric infectious diseases.', 4.7, 900, '["Monday","Tuesday","Wednesday","Thursday","Friday"]', '["09:00","09:30","10:00","10:30","11:00","14:00","15:00","16:00"]'),
(5, 'Dr. Ritu Shrestha', 'Cardiac Surgeon', 22, 'MBBS, MS, MCh Cardiac Surgery', 'Highly skilled cardiac surgeon with 500+ successful open heart surgeries.', 5.0, 3000, '["Tuesday","Thursday"]', '["10:00","11:00","14:00","15:00"]');
