import React from "react";

import Box from "@mui/material/Box";

export default function  TabPanel(props) {
    const { children, value, index, count, ...other } = props;
  
    return (
      <div {...other}>
        {value === index && <Box p={count}>{children}</Box>}
      </div>
    );
  }