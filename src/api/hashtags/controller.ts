import { Request, Response } from "express";
import client from "../../database/connection";
import queries from "./queries";
import userQueries from '../users/queries';

class HashtagController {
    async create (req: Request, res: Response) {
        const { name, userId } = req.body;
        const userFromDB = await client.query(userQueries.getById, [userId]);
        
        if (!userFromDB.rows[0]) return res.status(400).send('This user not exists');
        if(name.length > 10) return res.status(400).send('Hashtag must be less or equal than 10');
        
        try {
            const hashtagAlreadyExists = await client.query(queries.selectByName, [name]);

            if (hashtagAlreadyExists.rows[0]) {
            
                const userAlreadyHaveHashtag = await 
                client.query(queries.userAlreadyHaveHashtag, [name, userId]) 

                if (userAlreadyHaveHashtag.rows[0]) {
                    return res.status(400).send('You already have this hashtag');  
                } else {
                    await client.query(queries.setNewUserForThisHashtag, [userId, name]);
                    return res.status(200).send('You linked to this hashtag'); 
                };
            };            
        } catch (error) {
            return res.status(500).json({
                message: 'Internal Server Error',
                error
            });
        };

        try {
            client.query(queries.usersHashtagsInsert, [userId, name]);
            client.query(queries.insert, [name], (err, resp) => { 

                if (err) return res.status(500).send(err);
                return res.status(201).send();
            });
        } catch (err) {
            console.log(err);
            return res.status(500).send('Internal server error');
        };
    };

    async getHashtagsOfUser (req: Request, res: Response) {
        const { userId } = req.params;

        const hashtagsOfUser = (await client.query(queries.getHashtagsOfUser, [userId])).rows;

        const response = hashtagsOfUser.map(h => h.hashtag);

        return res.json({
            hashtagsOf: userId,
            response
        });
    };
};

export default new HashtagController();