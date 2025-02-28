import React from 'react';
import { Alert, Fade, Grid } from '@mui/material';

export const ErrorMessage: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;

  return (
    <Grid item xs={12}>
      <Fade in={true}>
        <div>
          <Alert severity="error" role="alert">
            {error}
          </Alert>
        </div>
      </Fade>
    </Grid>
  );
};
