import { styled } from '@mui/material/styles';
import { Button, Container, Typography } from '@mui/material';

// Styled Container for the URLShortener layout
export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius, // Use global border radius
  boxShadow: theme.shadows[3], // Consistent shadow level from theme
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2), // Adjust padding for smaller screens
  },
}));

// Styled Title for the URLShortener header
export const Title = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4, // Use global h4 typography
  marginBottom: theme.spacing(3),
}));

// Styled Shorten Button for the URLShortener
export const ShortenButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, // Gold from theme
  color: theme.palette.text.primary, // Black text for contrast
  '&:hover': {
    backgroundColor: '#E5BE00', // Slightly darker gold
  },
}));

// Styled Copy Button for the URLShortener
export const CopyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Purple from theme
  color: theme.palette.common.white, // White text
  '&:hover': {
    backgroundColor: '#5B0B9A', // Slightly darker purple
  },
}));
