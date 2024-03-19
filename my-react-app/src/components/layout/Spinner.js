import ClipLoader from 'react-spinners/ClipLoader'

function Spinner(props){
    const {loading} = props

    return(
        <ClipLoader color='#0ea5e9' loading={loading} size={150}/>
    )
}

export default Spinner