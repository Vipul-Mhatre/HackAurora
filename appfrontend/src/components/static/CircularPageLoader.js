import React from "react"; 

import CircularProgress  from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import '../../css/App.css';

export const CircularPageLoader = (props) => (
    <div> 
        <Backdrop
            open={props.open} 
            style={{  
                zIndex: 2000
            }}
        >
            <CircularProgress style={{  color: 'white' }}/>   
        </Backdrop> 
    </div>
) 