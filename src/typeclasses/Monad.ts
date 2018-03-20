import Chain from './Chain'
import Applicative from './Applicative'

export default interface Monad<T> extends Applicative<T>, Chain<T> {}