import Plus from 'typeclasses/Plus'
import Applicative from 'typeclasses/Applicative'

export default interface Alternative<T> extends Applicative<T>, Plus<T> {}