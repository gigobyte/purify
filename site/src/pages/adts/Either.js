import DataTypeContent from '../../components/DataTypeContent'
import data from '../../data'

export default DataTypeContent(data.datatypes.find((x) => x.name === 'Either'))
