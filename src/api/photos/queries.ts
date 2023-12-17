class Queries {
    insert = 'INSERT INTO photos (url, user_id) VALUES ($1, $2)';
    delete = 'DELETE FROM photos where id = $1';
    getPhotosOfUser = 'SELECT p.url as URL FROM photos p where user_id = $1';
    getPhotoByUrl = 'SELECT * FROM photos where url = $1';
}

export default new Queries();