import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { URLShortener } from './URLShortener';
import React from 'react';

describe('URLShortenerV2', () => {
  it("renders the long URL input and Shorten button in 'initial' mode", () => {
    render(<URLShortener />);

    // Verify input and button are in the document
    expect(
      screen.getByRole('textbox', { name: /enter your long url/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /shorten url/i })
    ).toBeInTheDocument();
  });

  it("clicking the 'Shorten' button triggers the shorten action", async () => {
    render(<URLShortener />);

    const enterUrlTextBox = screen.getByRole('textbox', {
      name: /enter your long url/i,
    });
    const shortenButton = screen.getByRole('button', { name: /shorten url/i });

    // Simulate entering a URL
    fireEvent.change(enterUrlTextBox, {
      target: { value: 'https://example.com/page1/page2/page3' },
    });
    expect(enterUrlTextBox).toHaveValue(
      'https://example.com/page1/page2/page3'
    );

    // Simulate clicking the Shorten button
    fireEvent.click(shortenButton);

    await waitFor(() => {
      const shortenedUrlTextBox = screen.getByRole('textbox', {
        name: /shortened url/i,
      });
      expect(shortenedUrlTextBox).toHaveValue('should-be-a-shortened-url');
      expect(
        screen.queryByRole('button', { name: /shorten url/i })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /shorten another/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });
  });

  it("clicking the 'Shorten Another' button resets the input field", async () => {
    render(<URLShortener />);

    const enterUrlTextBox = screen.getByRole('textbox', {
      name: /enter your long url/i,
    });
    const shortenButton = screen.getByRole('button', { name: /shorten url/i });

    // Simulate entering a URL
    fireEvent.change(enterUrlTextBox, {
      target: { value: 'https://example.com/page1/page2/page3' },
    });
    expect(enterUrlTextBox).toHaveValue(
      'https://example.com/page1/page2/page3'
    );

    // Simulate clicking the Shorten button
    fireEvent.click(shortenButton);

    await waitFor(() => {
      const shortenAnotherButton = screen.getByRole('button', {
        name: /shorten another/i,
      });
      fireEvent.click(shortenAnotherButton);
    });

    await waitFor(() => {
      // Verify reset state
      expect(
        screen.getByRole('textbox', { name: /enter your long url/i })
      ).toHaveValue('');
      expect(
        screen.queryByRole('textbox', { name: /shortened url/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /shorten another/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /copy/i })
      ).not.toBeInTheDocument();
    });
  });

  it("clicking the 'Shorten' for an empty url triggers an error messahe", async () => {
    render(<URLShortener />);

    const shortenButton = screen.getByRole('button', { name: /shorten url/i });
    fireEvent.click(shortenButton);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/Please enter a URL/i);
    });
  });
});
