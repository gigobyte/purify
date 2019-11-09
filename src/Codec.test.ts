import * as t from 'io-ts'
import { Codec, number, string, oneOf, GetInterface } from './Codec'

const User = Codec.interface({
  userId: number,
  name: string,
  stupid: oneOf([number, string])
})

interface User extends GetInterface<typeof User> {}

const User2 = t.type({
  userId: t.number,
  name: t.string,
  stupid: t.union([t.number, t.string])
})

type User2 = t.TypeOf<typeof User2>

const u = User.decode({ userId: 2, name: 'dsa', dasda: 5 })
const u2 = User2.decode({ userId: 2, name: 'dsa', dasda: 5 })

console.log(u)
console.log(u2)
