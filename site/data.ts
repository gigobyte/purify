interface Method {
    name: string
}

interface DataType {
    name: string,
    methods: Method[]
}

interface Data {
    datatypes: DataType[]
}

const data: Data = {
    datatypes: [
        {name: 'Maybe', methods: []},
        {name: 'Either', methods: []}
    ]
}

export { data, Data, DataType, Method }