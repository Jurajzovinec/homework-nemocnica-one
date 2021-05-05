import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider, Typography, makeStyles } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from "@material-ui/core/CssBaseline";
import DenseTable from './components/OcrResultTable';
import TextField from '@material-ui/core/TextField';

import loadFilesOnAWS from './lib/loadFilesOnAws';
import clearFilesBucketOnAWS from './lib/clearFilesBucketOnAWS';
import getDownloadFileFromAWS from './lib/getDownloadFromAWS';
import readTextFromImagesOnAws from './lib/readTextFromImagesOnAws';

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#322E2E",
    },
    primary: {
      main: '#fcf6f5'
    },
    secondary: deepOrange,
    text: {
      primary: "#554e4c",
      secondary: '#ded7d5'
    }
  },
  typography: {
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700
  }
});

const useStyles = makeStyles({
  containerButtons: {
    heigth: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  containerDownloadField: {
    heigth: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    padding: '1em',
    margin: '1em',
  },
  typography: {
    width: '100%',
    textAlign: 'center'
  },
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block',
    color: '#F5ECEA'
  },
  multilineColor: {
    color: 'red'
  }
});


function App() {

  const classes = useStyles();
  const [fileToDownload, setFileToDownload] = useState('');
  const [tableData, setTableData] = useState(undefined);

  const handleUploadCarSigns = async (eventTarget) => {

    if (eventTarget.files.length > 3) {
      alert('Upload 3 Files at max');
      return;
    }
    
    clearFilesBucketOnAWS()
      .then(res => {
        console.log(res);
        return loadFilesOnAWS(eventTarget);
      })
      .then(res => {
        console.log(res);
        return readTextFromImagesOnAws();
      })
      .then(newTableData => {
        console.log(newTableData);
        setTableData(newTableData);
      })
      .catch(error => console.error(error));

  };


  return (
    <ThemeProvider theme={theme}  >

      <CssBaseline />

      <Typography variant="h2" color="textSecondary" className={classes.typography}>OCR application</Typography>

      <Container className={classes.containerButtons}>

        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={(e) => handleUploadCarSigns(e.target)}

        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            className={classes.button}
          >
            Upload car signs images
          </Button>
        </label>

      </Container>

      <Container className={classes.containerDownloadField}>

        <form noValidate autoComplete="off" onSubmit={() => console.log('form')}>

          <TextField
            onChange={(e) => setFileToDownload(e.target.value)}
            label='Filed to download'
            fullWidth
            multiline
            InputProps={{
              className: classes.field
            }}
          />

          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              getDownloadFileFromAWS(fileToDownload);
            }}
          >
            Download Image
          </Button>

        </form>

      </Container>

      <DenseTable displayedData={tableData} />

    </ThemeProvider>
  );
}

export default App;
