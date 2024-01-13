import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Consuming the outer theme is only required with coexisting themes, like in this documentation.
// If your app/website doesn't deal with this, you can have just:
// const theme = createTheme({ direction: 'rtl' })
const theme = (outerTheme) =>
  createTheme({
    direction: 'rtl',
    palette: {
      mode: outerTheme.palette.mode,
    },
  });

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function TextFieldComponent({ outlinedText }) {
  return (
    <CacheProvider value={cacheRtl}>
        <div dir="rtl">
          <TextField 
            label={ outlinedText }
            variant="outlined"
          />
        </div>
    </CacheProvider>
  );
}