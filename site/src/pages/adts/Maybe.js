import DataTypeContent from '../../components/DataTypeContent'
import data from '../../data'

const maybe = data.datatypes.find(x => x.name === 'Maybe')

export default DataTypeContent(maybe)