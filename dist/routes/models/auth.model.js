export const registerUserByIdModel = ((newUser) => {
    return newUser.save(newUser)
        .then((user) => {
        return user;
    });
});
