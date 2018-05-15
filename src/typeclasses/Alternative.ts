import { Plus } from './Plus'
import { Applicative } from './Applicative'

export interface Alternative<T> extends Applicative<T>, Plus<T> {}