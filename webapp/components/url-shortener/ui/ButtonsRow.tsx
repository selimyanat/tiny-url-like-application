import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { CopyButton, ShortenButton } from './URLShortenerStyles';

export const ButtonsRow: React.FC<{
  mode: string;
  loading: boolean;
  shorten: () => void;
  reset: () => void;
  shortUrl: string | null;
}> = ({ mode, loading, shorten, reset, shortUrl }) => {
  return (
    <Grid item xs={12} container justifyContent="center" spacing={2}>
      <Grid item>
        {mode === 'initial' ? (
          <ShortenButton
            onClick={shorten}
            variant="contained"
            disabled={loading}
            aria-label="Shorten URL"
          >
            {loading ? <CircularProgress size={24} /> : 'Shorten'}
          </ShortenButton>
        ) : (
          <ShortenButton
            onClick={reset}
            variant="contained"
            aria-label="Shorten Another URL"
          >
            Shorten Another
          </ShortenButton>
        )}
      </Grid>
      {mode === 'shortened' && shortUrl && (
        <Grid item>
          <CopyButton
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            variant="contained"
            aria-label="Copy Shortened URL"
          >
            Copy
          </CopyButton>
        </Grid>
      )}
    </Grid>
  );
};
