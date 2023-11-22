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
});
export const pageNotFound = ((req, res) => {
    return error404(res, 'pageNotFound');
});
