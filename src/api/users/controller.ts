import { Request, Response } from "express";
import client from "../../database/connection";
import queries from "./queries";
import User from "../../entities/User";

class UserController {

    async create (req: Request, res: Response) {
        const { name, email, password } = req.body;

        const usersExists = await (await client.query(queries.getByEmail, [email])).rows[0];

        if (usersExists) return res.status(400).send('Email already exists');

        client.query(queries.insert, [name, email, password], err => {
            if (err) return res.status(500).send('Internal Server Error');
            return res.status(201).send();
        });
    };
    
    async getBetweenTwoValues (req: Request, res: Response): Promise<Response> {
        const { id1, id2 } = req.query;
        const users = (await client.query(queries.getBetweenTwoValues, [id1, id2]));
        return res.json(users.rows);
    };

    async getUsersWithThisHashtag (req: Request, res: Response) {
        const { hashtag } = req.params;
        
        const usersId = (await client.query(queries.getIdUsersWithThisHashtag, [hashtag])).rows;

        let usersJustId: number[] = [];
        usersId.forEach(objUserId => { 
            usersJustId.push(objUserId.user_id);
        });

        let users: User[] = [];

        let promises = usersJustId.map(async id => {
            let user = (await client.query(queries.getById, [id])).rows[0];
            users.push(user);
        });

        await Promise.all(promises);

        return res.json({
            usersWithHashtag: hashtag,
            users
        });
    };

    async getAllInfo (req: Request, res: Response) : Promise<Response> {
        const allInfo = await queries.getAllInfo(req.params.id);
        return res.json(allInfo);
    };

    async change (req: Request, res: Response) {
        const { id } = req.params;

        const { name, email, password, newPassword } = req.body;

        const passwordFromDB = (await client.query(queries.getPassword, [id])).rows[0].password;
        if (password !== passwordFromDB) {
            return res.status(400).send('incorrect password');
        } 

        const updatedAt = await (await client.query(queries.getById, [id])).rows[0].updatedat;
        const weekAfterUpdate = updatedAt * (1000*7*24*60*60);        

        const currentTime = Number(new Date());

        if (currentTime < weekAfterUpdate) {
            return res.status(400).send('You can only update your profile after 1 week...');
        }

        client.query(queries.update, [id, name, email, newPassword], err => {
            if (err) return res.status(500).send('Internal Server Error');
        });
        return res.status(204).send('Updated Successfully');
    };
};

export default new UserController();