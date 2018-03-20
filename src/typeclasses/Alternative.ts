import Plus from './Plus'
import Applicative from './Applicative'

export default interface Alternative<T> extends Applicative<T>, Plus<T> {}