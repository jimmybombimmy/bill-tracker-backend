import { getAllUsersModel } from "../models/users.models.js";
export const getAllUsers = ((req, res) => {
    getAllUsersModel()
        .then(result => {
        res.status(200).send(result);
    });
});
