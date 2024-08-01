import {Box} from '@mui/material'
import ReactMapGl from 'react-map-gl'

const AddLocation = () => {
  return (
    <Box 
    sx={{
        height:400,
        position:relative
    }}
    >
        <ReactMapGl mapboxAccessToken=''>

        </ReactMapGl>

    </Box>
  )
}

export default AddLocation