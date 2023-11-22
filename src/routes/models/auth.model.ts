export const registerUserByIdModel = ((newUser: any) => {
  return newUser.save(newUser)
    .then((user: object) => {
      return user
    })
    
})
