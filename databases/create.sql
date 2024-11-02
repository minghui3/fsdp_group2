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
