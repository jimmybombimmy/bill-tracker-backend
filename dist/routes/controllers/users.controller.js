import { getAllUsersModel, getUserByIdModel } from "../models/users.models.js";
import { error400, error404 } from "../errors.js";
export const getAllUsers = ((req, res) => {
    getAllUsersModel()
        .then((result) => {
        res.status(200).send(result);
    });
});
export const getUserById = ((req, res) => {
    const user_id = req.params.user_id;
    getUserByIdModel(user_id, res)
        .then((result) => {
        if (result) {
            res.status(200).send(result);
        }
        else {
            error404(res, 'userNotFound');
        }
    })
        .catch(() => {
        return error400(res, 'userNotHex');
    });
});
