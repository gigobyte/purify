import { Chain } from './Chain'
import { Applicative } from './Applicative'

export interface Monad<T> extends Applicative<T>, Chain<T> {}