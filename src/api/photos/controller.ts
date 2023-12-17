import { Request, Response } from "express";
import client from "../../database/connection";
import queries from "./queries";
import userQueries from '../users/queries'
import axios from 'axios';

class PhotoController {
    async create (req: Request, res: Response): Promise<Response> {
        const { url, userId } = req.body;

        const userExists = await (await client.query(userQueries.getById, [userId])).rows[0];
        if (!url) return res.status(400).send('Set the url');
        if (!userExists) return res.status(400).send('User not exists');

        const urlAlreadyExists = (await client.query(queries.getPhotoByUrl, [url])).rows[0];
        if(urlAlreadyExists) return res.status(400).send('url unavailable');

        const imigurUrl = new URL('', 'https://i.imgur.com/');
        
        try {
            
            const checkImigurUrl = new URL('', url);

            if (checkImigurUrl.hostname !== imigurUrl.hostname) {
                return res.status(400).send('Just Imigur.com photos here');
            } 

            const validateImage = await axios.get(url)
                .then(res => {
                    console.log(res.status);
                    return res.status;
                }).catch(e => false);
            
            console.log(validateImage);

            if (!validateImage || validateImage === 404) {
                return res.status(400).send('Insert a validate imigur.com image')
            }

            await client.query(queries.insert, [url, userId]);
            return res.status(201).send();
            

        } catch (error: any) {
            if (error.code === "ERR_INVALID_URL") {
                return res.status(400).send('Invalid URL. Set a imigur valid url.'); 
            } else {
                return res.status(500).send('Internal Server Error');
            }
        }
    };

    async getPhotosOfUser (req: Request, res: Response) : Promise<Response> {
        const { userId } = req.params;
        const photos = (await client.query(queries.getPhotosOfUser, [userId]))
        .rows.map(obj => obj.url);
        return res.json(photos);
    };

    async deletePhoto (req: Request, res: Response) {
        const { id } = req.params;
        
        client.query(queries.delete, [id], err => {
            if (err) return res.status(500).send(err);
        });
        return res.status(204).send('Deleted Successfully');
    };

}

export default new PhotoController();