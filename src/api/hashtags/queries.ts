class Queries {
    insert = 'INSERT INTO hashtags (name) VALUES ($1)';
    selectByName = 'SELECT * FROM hashtags where name = $1';
    usersHashtagsInsert = 'INSERT INTO users_hashtags (user_id, hashtag) VALUES ($1, $2)';
    getHashtagsOfUser = 'SELECT * FROM users_hashtags where user_id = $1';
    userAlreadyHaveHashtag = "SELECT * FROM users_hashtags where hashtag = $1 and user_id = $2";
    setNewUserForThisHashtag = 'INSERT INTO users_hashtags (user_id, hashtag) VALUES ($1, $2)';
}

export default new Queries();