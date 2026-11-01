DROP TABLE IF EXISTS daily_application_stats;

CREATE TABLE IF NOT EXISTS daily_application_stats (
        id BIGINT NOT NULL AUTO_INCREMENT,
        user_id CHAR(36) NOT NULL,
        apply_date DATE NOT NULL,
        apply_count INT NOT NULL DEFAULT 0,

        CONSTRAINT pk_daily_application_stats PRIMARY KEY (id),
        CONSTRAINT uk_user_apply_date UNIQUE (user_id, apply_date),
        CONSTRAINT chk_apply_count CHECK (apply_count >= 0)
);

INSERT INTO daily_application_stats
(user_id, apply_date, apply_count)
VALUES
    ('a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', '2026-10-22', 3),
    ('a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', '2026-10-23', 5),
    ('a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', '2026-10-24', 2),
    ('a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', '2026-10-26', 4),
    ('a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d34', '2026-10-27', 1),
    ('b23f6a81-8c4d-5e92-0b73-2a9d1f6c8e45', '2026-10-23', 2),
    ('b23f6a81-8c4d-5e92-0b73-2a9d1f6c8e45', '2026-10-24', 3),
    ('b23f6a81-8c4d-5e92-0b73-2a9d1f6c8e45', '2026-10-25', 6),
    ('c34a7b92-9d5e-6f03-1c84-3a0e2b7d9f56', '2026-10-25', 4),
    ('c34a7b92-9d5e-6f03-1c84-3a0e2b7d9f56', '2026-10-26', 2);