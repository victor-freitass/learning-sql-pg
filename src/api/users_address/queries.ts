class Queries {
    alreadyExists = 'SELECT * FROM users_address where user_id = $1';
    insert = 'INSERT INTO users_address (cep, user_id) VALUES ($1, $2)';
    getUserById = 'SELECT * FROM users where id = $1';
    update = 'UPDATE users_address SET cep = $1 WHERE user_id = $2';
};

export default new Queries();