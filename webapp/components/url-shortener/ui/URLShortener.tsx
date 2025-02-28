'use client';

import { useURLShortener } from '../hooks/useURLShortener';
import React from 'react';
import Grid from '@mui/material/Grid';
import { StyledContainer, Title } from './URLShortenerStyles';

import { LongUrlInput } from './LongUrlInput';
import { ShortenedUrlDisplay } from './ShortenedUrlDisplay';
import { ErrorMessage } from './ErrorMessage';
import { ButtonsRow } from './ButtonsRow';

export const URLShortener: React.FC = () => {
  const {
    longUrl,
    setLongUrl,
    shortUrl,
    loading,
    error,
    shorten,
    mode,
    reset,
  } = useURLShortener();

  return (
    <StyledContainer maxWidth="sm">
      <Title variant="h4">TinyURL like application</Title>
      <Grid container spacing={3}>
        {/* Long URL Input */}
        <LongUrlInput mode={mode} longUrl={longUrl} setLongUrl={setLongUrl} />

        {/* Shortened URL Display */}
        <ShortenedUrlDisplay mode={mode} shortUrl={shortUrl} />

        {/* Error Message */}
        <ErrorMessage error={error} />

        {/* Buttons Row */}
        <ButtonsRow
          mode={mode}
          loading={loading}
          shorten={shorten}
          reset={reset}
          shortUrl={shortUrl}
        />
      </Grid>
    </StyledContainer>
  );
};
