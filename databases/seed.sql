DROP TABLE IF EXISTS users,results

CREATE Table users(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);

CREATE Table results(
	result_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	executed_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	executed_date DATE NOT NULL,
	result VARCHAR(20) NOT NULL CHECK (result in ('Passed','Failed'))
);
INSERT INTO users(username, password)
VALUES
	('poppy', 'user123'),
	('polka', 'user234'),
	('johnstu', 'user345'),
	('johnpork', 'mamapork123'),
	('trump','kamala');
    
INSERT INTO results (name, executed_by, executed_date, result)
VALUES 
    ('Employee Login Functionality', 1, '2024-10-18', 'Passed'),
    ('View Employee Directory', 2, '2024-10-18', 'Passed'),
    ('Submit Leave Application', 3, '2024-10-17', 'Failed'),
    ('Approve Leave Request', 1, '2024-10-17', 'Passed'),
    ('Reject Leave Request', 3, '2024-10-17', 'Passed'),
    ('Submit Expense Claim', 1, '2024-10-16', 'Failed'),
    ('Approve Expense Claim', 4, '2024-10-16', 'Passed'),
    ('View Leave and Claim Status', 2, '2024-10-16', 'Failed');