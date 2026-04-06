'use client';

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  alpha,
  useTheme,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";

export default function ContactForm() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("name", formData.name);
      params.append("phone", formData.phone);
      params.append("email", formData.email);
      params.append("interest", formData.interest);
      params.append("message", formData.message);

      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL!, {
        method: "POST",
        mode: "no-cors",           // ← critical for Google Apps Script
        body: params,
      });

      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", interest: "", message: "" });
    } catch (err) {
      console.error("Form error:", err);
    } finally {
      setLoading(false);
    }
  };
  const textFieldStyle = {
    '& .MuiInput-underline:before': { borderBottomColor: alpha(theme.palette.primary.main, 0.2) },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: theme.palette.primary.main },
    '& .MuiInput-underline:after': { borderBottomColor: theme.palette.primary.main },
    '& .MuiInputBase-input': { color: theme.palette.text.primary, fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.875rem' },
    '& .MuiInputLabel-root': { color: theme.palette.primary.main, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.65rem' }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h3" sx={{ fontSize: '1.5rem', color: 'text.primary', fontFamily: 'var(--font-playfair-display), serif', mb: 2 }}>Send Us a Message</Typography>
        <Box sx={{ width: 40, height: 1, bgcolor: 'primary.main' }} />
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
          <TextField fullWidth name="name" value={formData.name} onChange={handleChange} variant="standard" label="Full Name*" placeholder="Priya Sharma" required sx={textFieldStyle} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth name="phone" value={formData.phone} onChange={handleChange} variant="standard" label="Phone Number" placeholder="+91 98000 00000" sx={textFieldStyle} InputLabelProps={{ shrink: true }} />
        </Box>
        <TextField fullWidth name="email" value={formData.email} onChange={handleChange} variant="standard" label="Email Address*" placeholder="priya@example.com" type="email" required sx={textFieldStyle} InputLabelProps={{ shrink: true }} />
        <FormControl fullWidth variant="standard" sx={textFieldStyle}>
          <InputLabel shrink sx={{ color: 'primary.main' }}>I&rsquo;m Interested In</InputLabel>
          <Select name="interest" value={formData.interest} onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value as string }))} displayEmpty sx={{ '&:before': { borderBottomColor: alpha(theme.palette.primary.main, 0.2) }, '&:after': { borderBottomColor: theme.palette.primary.main }, '& .MuiSelect-select': { py: 1, color: theme.palette.text.secondary, fontSize: '0.875rem' } }}>
            <MenuItem value="" disabled>Select an option</MenuItem>
            <MenuItem value="bridal">Bridal Jewellery</MenuItem>
            <MenuItem value="custom">Bespoke / Custom Design</MenuItem>
            <MenuItem value="gifting">Gifting</MenuItem>
            <MenuItem value="general">General Inquiry</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth name="message" value={formData.message} onChange={handleChange} variant="standard" label="Message*" placeholder="Tell us more about what you're looking for..." multiline rows={4} required sx={textFieldStyle} InputLabelProps={{ shrink: true }} />
        <Button type="submit" variant="contained" disabled={loading} className="btn-gold-shimmer" sx={{ py: 2.5, fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 600 }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Send Message"}
        </Button>
      </Box>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ bgcolor: 'background.paper', color: 'primary.main', border: `1px solid ${theme.palette.primary.main}`, width: '100%' }}>
          Your message has been received. Our team will contact you shortly.
        </Alert>
      </Snackbar>
    </Box>
  );
}
