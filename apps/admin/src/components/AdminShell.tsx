'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  Coins,
  CalendarDays,
  Newspaper,
  Menu as MenuIcon,
  LogOut,
  UserCircle,
} from 'lucide-react';

import { ADMIN_NAVIGATION, type NavItem } from '@/constants/navigation';
import { logout } from '@/app/actions/auth';
import { PALETTE } from '@/theme';

const DRAWER_WIDTH = 248;

const ICONS = {
  dashboard: LayoutDashboard,
  gem: Gem,
  folder: FolderTree,
  coins: Coins,
  calendar: CalendarDays,
  article: Newspaper,
} as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

  return (
    <List sx={{ px: 1.5, py: 2 }}>
      {ADMIN_NAVIGATION.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(item);

        return (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            onClick={onNavigate}
            selected={active}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              py: 1,
              '&.Mui-selected': {
                bgcolor: alpha(PALETTE.sage, 0.28),
                '&:hover': { bgcolor: alpha(PALETTE.sage, 0.36) },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.secondary' }}>
              <Icon size={18} strokeWidth={1.75} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              secondary={item.description}
              slotProps={{
                primary: {
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'primary.main' : 'text.primary',
                },
                secondary: { fontSize: '0.7rem' },
              }}
            />
            {item.comingSoon && (
              <Chip
                label="Soon"
                size="small"
                sx={{ height: 18, fontSize: '0.6rem', bgcolor: PALETTE.blushWash, color: PALETTE.inkSoft }}
              />
            )}
          </ListItemButton>
        );
      })}
    </List>
  );
}

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const brand = (
    <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box>
        <Typography sx={{ fontFamily: 'var(--font-playfair-display), Georgia, serif', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.2 }}>
          Nihaa Jewels
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Admin
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            edge="start"
            sx={{ display: { md: 'none' } }}
            aria-label="Open navigation"
          >
            <MenuIcon size={20} />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Account menu">
            <UserCircle size={22} strokeWidth={1.5} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{userEmail}</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Signed in</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => logout()} sx={{ gap: 1.5, fontSize: '0.85rem', mt: 0.5 }}>
              <LogOut size={16} strokeWidth={1.75} />
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop ? true : mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {brand}
          <Divider />
          <NavList onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, px: { xs: 2, md: 4 }, py: 3 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
