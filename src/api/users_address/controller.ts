import { Request, Response } from "express";
import queries from "./queries";
import client from "../../database/connection";

class UserAdressController {
    async create (req: Request, res: Response): Promise<Response | undefined> {
        const { cep, user_id } = req.body;

        if (!cep || !user_id) return res.status(400).send('Set all info');
        const userAlreadyHaveAddress = (await client.query(queries.alreadyExists, [user_id])).rows[0];
        if (userAlreadyHaveAddress) return res.status(400).send('User already have address');

        const user = await (await client.query(queries.getUserById, [user_id])).rows[0];
        if (!user) return res.status(400).send('User not exists');

        client.query(queries.insert, [cep, user_id], err => {
            if (err) return res.status(500).send(err);
            return res.status(201).send();
        });
    };

    async change (req: Request, res: Response) {
        const { userId } = req.params;
        const { cep } = req.body; 

        await client.query(queries.update, [cep, userId]);
        return res.status(204).send(`Address updated successfully`);
    };
};

export default new UserAdressController();