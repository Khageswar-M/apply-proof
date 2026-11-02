DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
                                     id CHAR(36) NOT NULL,
    email VARCHAR(254) NOT NULL,
    email_verified BOOLEAN NOT NULL,
    is_login BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
    );

INSERT INTO users (
    id,
    email,
    email_verified,
    is_login,
    created_at,
    updated_at
)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'aarav.sharma@example.com', TRUE, TRUE, '2026-09-01 09:15:00.000000', '2026-09-01 09:20:00.000000'),
    ('22222222-2222-4222-8222-222222222222', 'priya.patel@example.com', TRUE, TRUE, '2026-09-02 10:30:00.000000', '2026-09-02 10:30:00.000000'),
    ('33333333-3333-4333-8333-333333333333', 'rahul.kumar@example.com', FALSE, FALSE, '2026-09-03 11:45:00.000000', '2026-09-03 11:45:00.000000'),
    ('44444444-4444-4444-8444-444444444444', 'sneha.mishra@example.com', TRUE, TRUE, '2026-09-04 12:00:00.000000', '2026-09-04 12:10:00.000000'),
    ('55555555-5555-4555-8555-555555555555', 'rohit.verma@example.com', FALSE, FALSE, '2026-09-05 14:20:00.000000', '2026-09-05 14:20:00.000000'),
    ('66666666-6666-4666-8666-666666666666', 'ananya.das@example.com', TRUE, TRUE, '2026-09-06 15:35:00.000000', '2026-09-06 15:40:00.000000'),
    ('77777777-7777-4777-8777-777777777777', 'vikash.singh@example.com', TRUE, TRUE, '2026-09-07 08:50:00.000000', '2026-09-07 08:50:00.000000'),
    ('88888888-8888-4888-8888-888888888888', 'neha.panda@example.com', FALSE, FALSE, '2026-09-08 16:10:00.000000', '2026-09-08 16:10:00.000000'),
    ('99999999-9999-4999-8999-999999999999', 'arjun.mohanty@example.com', TRUE, TRUE, '2026-09-09 13:25:00.000000', '2026-09-09 13:30:00.000000'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'khageswar.test@example.com', TRUE, TRUE, '2026-09-10 17:00:00.000000', '2026-09-10 17:05:00.000000');