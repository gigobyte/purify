import Chain from 'typeclasses/Chain'
import Applicative from 'typeclasses/Applicative'

export default interface Monad<T> extends Applicative<T>, Chain<T> {}