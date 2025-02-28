import React from 'react';
import { Fade, Grid, TextField } from '@mui/material';

export const LongUrlInput: React.FC<{
  mode: string;
  longUrl: string;
  setLongUrl: (value: string) => void;
}> = ({ mode, longUrl, setLongUrl }) => {
  if (mode !== 'initial' && mode !== 'shortened') return null;

  return (
    <Grid item xs={12}>
      <Fade in={true}>
        <div>
          <TextField
            label="Enter your long URL"
            fullWidth
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            variant="outlined"
            aria-label="Enter your long URL"
          />
        </div>
      </Fade>
    </Grid>
  );
};
