import client from "../../database/connection";

class Queries {

    constructor () {
        client.query
    }

    getBetweenTwoValues = 'SELECT * FROM users where id >= $1 and id <= $2';
    insert = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    getById = 'SELECT * FROM users where id = $1';
    getIdUsersWithThisHashtag = 'SELECT uh.user_id FROM users_hashtags uh where hashtag = $1';
    getUsersHashtag = 'SELECT u.id, u.name, u.email FROM users u where id in ($1)';
    getByEmail = 'SELECT u.email from users u where email = $1';
    getHashtags = 'SELECT * FROM users_hashtags where user_id = $1';
    getPhotos = 'SELECT p.url as URL FROM photos p where user_id = $1';
    getCep = 'SELECT cep FROM users_address where user_id = $1';
    getPassword = 'SELECT password FROM users where id = $1'; 
    update = 'UPDATE users SET name = $2, email = $3, password = $4, updatedat = now() WHERE id = $1';

    public async getAllInfo (userId: string): Promise<any> {
        const user = (await client.query(this.getById, [userId])).rows
        const hashtags = (await client.query(this.getHashtags, [userId])).rows;
        const photos = (await client.query(this.getPhotos, [userId])).rows;
        const cep = (await client.query(this.getCep, [userId])).rows[0];

        const allInfo = Object.assign({
            user,
            cep,
            photos,
            hashtags
        });

        return allInfo;
    };
};

export default new Queries();