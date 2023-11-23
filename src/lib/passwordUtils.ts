import crypto from 'crypto'

export function genPassword(password: string) {
  var salt = crypto.randomBytes(32).toString('hex')
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

  return {
    salt: salt,
    hash: genHash
  }
}

export function validPassword(password: string, hash: string|null|undefined, salt: any) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === hashVerify
}

