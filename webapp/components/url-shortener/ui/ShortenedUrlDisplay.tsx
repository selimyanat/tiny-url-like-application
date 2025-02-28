import React from 'react';
import { Fade, Grid, TextField } from '@mui/material';

export const ShortenedUrlDisplay: React.FC<{
  mode: string;
  shortUrl: string | null;
}> = ({ mode, shortUrl }) => {
  if (mode !== 'shortened') return null;

  return (
    <Grid item xs={12}>
      <Fade in={true}>
        <div>
          <TextField
            label="Shortened URL"
            fullWidth
            value={shortUrl}
            InputProps={{ readOnly: true }}
            variant="outlined"
            aria-label="Shortened URL"
          />
        </div>
      </Fade>
    </Grid>
  );
};
