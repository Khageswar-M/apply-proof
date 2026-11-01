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



CREATE INDEX idx_job_applications_user_id ON job_applications (user_id);