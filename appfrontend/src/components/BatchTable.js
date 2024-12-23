import React from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    Modal,
    Box,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    Grid,
} from "@mui/material";

let Ldata = JSON.parse(localStorage.getItem("Ldata")) || [];

export default class BatchTable extends React.Component {
    state = {
        page: 0,
        rowsPerPage: 5,
        modalOpen: false,
        reportModalOpen: false, // For the report modal
        region: "",
        energyType: "",
        materialSourcing: "",
        productionVolume: "",
        productType: "",
        transportMode: "",
        distanceKm: "",
        storageType: "",
        shelfDays: "",
        selectedRow: null, // to store the selected row for sustainability data
        susData: {}, // To store sustainability data for display in the report modal
        prediction: null
    };

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleModalToggle = (row = null) => {
        if (row) {
            this.setState((prevState) => ({
                modalOpen: !prevState.modalOpen,
                selectedRow: row,
            }));
        } else {
            this.setState((prevState) => ({
                modalOpen: false
            }));
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleReportModalToggle = () => {
        this.setState((prevState) => ({
            reportModalOpen: !prevState.reportModalOpen,
        }));
    };

    getDatafromLs() {
        Ldata = localStorage.getItem('Ldata');
    }


    handleSubmit = () => {
        const { selectedRow, region, energyType, materialSourcing, productionVolume, productType, transportMode, distanceKm, storageType, shelfDays } = this.state;

        // Prepare the sustainability data
        const sustainabilityData = {
            region,
            energyType,
            materialSourcing,
            productionVolume,
            productType,
            transportMode,
            distanceKm,
            storageType,
            shelfDays,
        };

        const existingData = localStorage.getItem('Ldata');
        console.log(existingData);
        let Ldata = existingData ? JSON.parse(existingData) : []; // Retrieve and parse existing data from local storage
        console.log(Ldata);

        const updatedLdata = Ldata.some(item => item.productId === selectedRow.productId)
            ? Ldata.map(item =>
                item.productId === selectedRow.productId
                    ? { ...item, sustainabilityData: { ...item.sustainabilityData, ...sustainabilityData } }
                    : item
            )
            : [...Ldata, { productId: selectedRow.productId, sustainabilityData }]; // Add new entry if not found

        localStorage.setItem('Ldata', JSON.stringify(updatedLdata)); // Save updated data back to local storage

        // Close the modal
        // this.getDatafromLs();
        this.handleModalToggle();
    };


    fetchReport(id) {
        console.log(id)
        const data = Ldata?.find((sdata) => sdata.productId === id);
        console.log(data);

        if (data) {
            // Prepare the data to send to the Flask backend
            const payload = {
                region: data.sustainabilityData.region,
                energy_type: data.sustainabilityData.energyType,
                material_sourcing: data.sustainabilityData.materialSourcing,
                production_volume: data.sustainabilityData.productionVolume,
                product_type: data.sustainabilityData.productType,
                transport_mode: data.sustainabilityData.transportMode,
                distance_km: data.sustainabilityData.distanceKm,
                storage_type: data.sustainabilityData.storageType,
                shelf_days: data.sustainabilityData.shelfDays,
            };

            // Update state for sustainability data
            this.setState({ susData: payload });

            // Make the fetch request to the Flask backend
            fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload).toString(), // Convert payload to URLSearchParams
            })
                .then(response => response.json())
                .then(data => {
                    // Show the prediction in the modal (example)
                    this.setState({ prediction: data.prediction });
                    this.handleModalToggle();  // Close the add data modal before opening the report modal
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });

            // Now open the report modal
            this.setState((prevState) => ({
                reportModalOpen: !prevState.reportModalOpen,
            }));
        } else {
            console.error("No matching data found");
        }
    }




    render() {
        const {
            page,
            rowsPerPage,
            modalOpen,
            reportModalOpen,
            region,
            energyType,
            materialSourcing,
            productionVolume,
            productType,
            transportMode,
            distanceKm,
            storageType,
            shelfDays,
            selectedRow,
            susData,
            prediction
        } = this.state;

        return (
            <Paper elevation={0} style={{ minHeight: 450 }}>
                <TableContainer style={{ minHeight: 420 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {this.props.cols.map((col) => (
                                    <TableCell key={col.field} align={col.align}>
                                        {col.title.toUpperCase()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.rows.length > 0 ? (
                                this.props.rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        const productData = Ldata.find(item => item.productId === row.productId);
                                        return (
                                            <TableRow hover tabIndex={-1} key={row.productId}>
                                                <TableCell component="th" scope="row" align="left" width="10%">
                                                    {row.productId}
                                                </TableCell>
                                                <TableCell align="left" width="20%">
                                                    {row.productName}
                                                </TableCell>
                                                <TableCell align="left" width="10%">
                                                    {row.productStatus}
                                                </TableCell>
                                                <TableCell align="center" width="20%">
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        disabled={row.disableActionButton}
                                                        onClick={() => this.props.showConfirmActionPopUp(row.action, row.productId)}
                                                    >
                                                        {row.action}
                                                    </Button>
                                                </TableCell>
                                                <TableCell align="center" width="20%">
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => this.props.toggleBatchDetailsPopUp(row)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                                {this.props.sussy && (
                                                    productData ? (
                                                        <TableCell align="center" width="20%">
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => this.fetchReport(row.productId)}
                                                            >
                                                                View Sustainability Report
                                                            </Button>
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell align="center" width="20%">
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => this.handleModalToggle(row)}
                                                            >
                                                                Add Sustainability Data
                                                            </Button>
                                                        </TableCell>
                                                    )
                                                )}
                                            </TableRow>
                                        );
                                    })
                            ) : (
                                <TableRow tabIndex={-1}>
                                    <TableCell colSpan={6} align="center">
                                        {this.props.emptyRowsMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={this.props.rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={this.handleChangePage}
                />

                {/* Modal for Inputs */}
                <Modal open={modalOpen} onClose={this.handleModalToggle}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            padding: 4,
                            boxShadow: 24,
                            borderRadius: 2,
                            width: 400,
                        }}
                    >
                        <h2>Enter Product Sustainability Details</h2>
                        <Grid container spacing={2}>
                            {/* Region Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Region</InputLabel>
                                    <Select
                                        label="Region"
                                        name="region"
                                        value={region}
                                        onChange={this.handleInputChange}
                                    >
                                        <MenuItem value="urban">Urban</MenuItem>
                                        <MenuItem value="rural">Rural</MenuItem>
                                        <MenuItem value="coastal">Coastal</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Energy Type Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Energy Type</InputLabel>
                                    <Select
                                        label="Energy Type"
                                        name="energyType"
                                        value={energyType}
                                        onChange={this.handleInputChange}
                                    >
                                        <MenuItem value="renewable">Renewable</MenuItem>
                                        <MenuItem value="non-renewable">Non-Renewable</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Material Sourcing Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Material Sourcing</InputLabel>
                                    <Select
                                        label="Material Sourcing"
                                        name="materialSourcing"
                                        value={materialSourcing}
                                        onChange={this.handleInputChange}
                                    >
                                        <MenuItem value="local">Local</MenuItem>
                                        <MenuItem value="imported">Imported</MenuItem>
                                        <MenuItem value="recycled">Recycled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Production Volume Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Production Volume"
                                    type="number"
                                    fullWidth
                                    name="productionVolume"
                                    value={productionVolume}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>

                            {/* Product Type Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Product Type</InputLabel>
                                    <Select
                                        label="Product Type"
                                        name="productType"
                                        value={productType}
                                        onChange={this.handleInputChange}
                                    >
                                        <MenuItem value="perishable">Perishable</MenuItem>
                                        <MenuItem value="non-perishable">Non-Perishable</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Transport Mode Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Transport Mode</InputLabel>
                                    <Select
                                        label="Transport Mode"
                                        name="transportMode"
                                        value={transportMode}
                                        onChange={this.handleInputChange}
                                    >
                                        <MenuItem value="road">Road</MenuItem>
                                        <MenuItem value="air">Air</MenuItem>
                                        <MenuItem value="sea">Sea</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Distance (km) Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Distance (km)"
                                    type="number"
                                    fullWidth
                                    name="distanceKm"
                                    value={distanceKm}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>

                            {/* Storage Type Dropdown */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Storage Type</InputLabel>
                                    <Select
                                        label="Storage Type"
                                        name="storageType"
                                        value={storageType}
                                        onChange={this.handleInputChange}
                                    >
                                        <MenuItem value="refrigerated">Refrigerated</MenuItem>
                                        <MenuItem value="ambient">Ambient</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Shelf Days Input */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Shelf Days"
                                    type="number"
                                    fullWidth
                                    name="shelfDays"
                                    value={shelfDays}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginTop: 20 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={this.handleSubmit}
                                >
                                    Submit Data
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>

                {/* Modal for Viewing Sustainability Report */}
                {/* Modal for Viewing Sustainability Report */}
                <Modal open={reportModalOpen} onClose={this.handleReportModalToggle}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            padding: 4,
                            boxShadow: 24,
                            borderRadius: 2,
                            width: 400,
                        }}
                    >
                        <h2>Sustainability Report</h2>

                        {/* Display Prediction */}
                        <pre>{this.state.prediction > 50 ? "🎉" : ""}{this.state.prediction}%</pre>

                        {/* Display sustainability data with appropriate heading levels */}
                        <h3>Region: {this.state.susData.region}</h3>
                        <h4>Energy Type: {this.state.susData.energy_type}</h4>
                        <h4>Material Sourcing: {this.state.susData.material_sourcing}</h4>
                        <h4>Product Type: {this.state.susData.product_type}</h4>
                        <h4>Transport Mode: {this.state.susData.transport_mode}</h4>
                        <h4>Storage Type: {this.state.susData.storage_type}</h4>
                        <h4>Production Volume: {this.state.susData.production_volume}</h4>
                        <h4>Shelf Days: {this.state.susData.shelf_days}</h4>

                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={this.handleReportModalToggle}
                        >
                            Close
                        </Button>
                    </Box>
                </Modal>
            </Paper>
        );
    }
}