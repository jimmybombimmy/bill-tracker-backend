export const error400 = ((res, reason) => {
    if (reason === 'userNotHex') {
        res.status(400).send({
            message: 'Error 400 - Bad Request: User path must be a number'
        });
    }
    else if (reason === 'txnInfoMissing') {
        res.status(400).send({
            message: 'Error 400 - Bad Request: Transaction info incomplete'
        });
    }
    else if (reason === 'txnInfoIncorrect') {
        res.status(400).send({
            message: 'Error 400 - Bad Request: Transaction info should be a number'
        });
    }
    else if (reason === 'txnIdNotValid') {
        res.status(400).send({
            message: 'Error 400 - Bad Request: Transaction ID not valid'
        });
    }
});
export const error401 = ((res, reason) => {
    if (reason === 'userNotMatched') {
        res.status(401).send({ message: 'Error 401: Username or Password is incorrect' });
    }
    else if (reason === 'userNotAuthed') {
        res.status(401).send({ message: 'Error 401: User is not authorized to view information' });
    }
    else if (reason === 'emailNotMatched') {
        res.status(401).send({ message: 'Error 401: Email does not match our records' });
    }
});
export const error404 = ((res, reason) => {
    if (reason === 'pageNotFound') {
        res.status(404).send({
            message: 'Error 404: Page not found'
        });
    }
    else if (reason === 'userNotFound') {
        res.status(404).send({
            message: 'Error 404: User ID not found'
        });
    }
    else if (reason === 'txnIdNotFound') {
        res.status(404).send({
            message: 'Error 404: Transaction ID not found'
        });
    }
});
export const error408 = ((res, reason) => {
    res.status(408).send({
        message: `Error 408: ${reason}`
    });
});
export const error409 = ((res, reason) => {
    res.status(409).send({
        message: `Error 409: ${reason}`
    });
});
export const pageNotFound = ((req, res) => {
    return error404(res, 'pageNotFound');
});
