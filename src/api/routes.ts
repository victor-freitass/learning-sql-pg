import { Router } from 'express';
import UserController from './users/controller';
import HashtagController from './hashtags/controller';
import PhotoController from './photos/controller';
import UserAdressController from './users_address/controller';

class Routes {
    router: Router

    constructor () {
        this.router = Router();
        this.routes()
    }
    
    private routes() {
        this.router.post('/users', UserController.create);
        this.router.get('/users/getBetweenTwoValues', UserController.getBetweenTwoValues);
        this.router.get('/users/hashtag/:hashtag', UserController.getUsersWithThisHashtag);
        this.router.get('/users/allinfo/:id', UserController.getAllInfo);
        this.router.put('/users/:id', UserController.change);

        this.router.post('/hashtags', HashtagController.create);
        this.router.get('/hashtags/:userId', HashtagController.getHashtagsOfUser);

        this.router.post('/photos', PhotoController.create);
        this.router.get('/photos/:userId', PhotoController.getPhotosOfUser);
        this.router.delete('/photos/:id', PhotoController.deletePhoto);

        this.router.post('/address', UserAdressController.create);
        this.router.put('/address/:userId', UserAdressController.change);

    }

}

export default new Routes().router