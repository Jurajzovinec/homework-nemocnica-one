import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    tableContainer: {
        padding: '2em',
        marginTop: '3em',
        marginBottom: '3em'
    }
});

export default function DenseTable({ displayedData }) {

    const classes = useStyles();

    return (
        <>
            {displayedData ?
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell >Original&nbsp;image</TableCell>
                                <TableCell align="right">Threshold&nbsp;image</TableCell>
                                <TableCell align="right">Validation&nbsp;error</TableCell>
                                <TableCell align="right">Application&nbsp;error</TableCell>
                                <TableCell align="right">Found&nbsp;text</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedData.map((tableRow) => (
                                <TableRow key={tableRow.originalImageName}>
                                    <TableCell component="th" scope="row">{tableRow.originalImageName}</TableCell>
                                    <TableCell align="right">{tableRow.thresholdImageName}</TableCell>
                                    <TableCell align="right">{tableRow.validationError}</TableCell>
                                    <TableCell align="right">{tableRow.childProcessError}</TableCell>
                                    <TableCell align="right">{tableRow.imageText}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> : null
            }
        </>
    );
}