DROP TABLE IF EXISTS job_applications;

CREATE TABLE job_applications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    application_resource VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    resume_name VARCHAR(100) NOT NULL,
    applied_date_time TIMESTAMP(6) NOT NULL
);

INSERT INTO job_applications
(id, user_id, company_name, application_resource, status, applied_date_time, resume_name)
VALUES
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30', 'Google',    'LinkedIn',   'APPLIED',          '2026-10-21 10:30:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30', 'Amazon',    'LinkedIn',   'RECRUITER_CALL',   '2026-10-22 14:15:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30', 'Microsoft', 'Naukri.com', 'ASSESSMENT',       '2026-10-23 09:45:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30', 'Infosys',   'Naukri.com', 'APPLIED',          '2026-10-24 11:20:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30', 'TCS',       'Naukri.com', 'FINAL_DISCUSSION', '2026-10-25 15:00:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d31', 'Accenture', 'Naukri.com', 'OFFER',            '2026-10-26 12:30:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d31', 'Wipro',     'Naukri.com', 'APPLIED',          '2026-10-27 16:10:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d31', 'Oracle',    'Naukri.com', 'RECRUITER_CALL',   '2026-10-28 10:00:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', 'IBM',       'Naukri.com', 'ASSESSMENT',       '2026-10-29 13:45:00', 'Khageswar-Java-Fullstack-CV'),
    (RANDOM_UUID(), 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', 'Adobe',     'Naukri.com', 'APPLIED',          '2026-10-30 09:15:00', 'Khageswar-Java-Fullstack-CV');