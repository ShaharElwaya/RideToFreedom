import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { theme } from '@/pages/api/theme/theme';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function TextFieldComponent({ outlinedText, type }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const textFieldStyle = {
    width: '250px', // Set a fixed width for both text fields
  };

  const iconStyle = {
    fontSize: '20px',
    marginLeft: '7px'
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <TextField
            label={outlinedText}
            variant="outlined"
            type={showPassword ? 'text' : type}
            style={textFieldStyle}
            InputProps={{
              endAdornment:
                type === 'password' ? (
                  <InputAdornment position="end" style={{ marginLeft: '-20px' }}>
                    <IconButton onClick={handleTogglePassword} edge="end" style={iconStyle}>
                      {showPassword ? (
                        <VisibilityOff style={iconStyle} />
                      ) : (
                        <Visibility style={iconStyle} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : null,
            }}
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
