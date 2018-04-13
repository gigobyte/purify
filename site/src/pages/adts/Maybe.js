import DataTypeContent from '../../components/DataTypeContent'
import data from '../../data'

const maybe = data.datatypes.find(x => x.slug === 'maybe')

export default DataTypeContent(maybe)