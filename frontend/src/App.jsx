import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import ScheduleClassPage from './pages/ScheduleClassPage';
import StudentClassesPage from './pages/StudentClassesPage';
import TeacherClassesPage from './pages/TeacherClassesPage';
import StudentDashboard from './pages/StudentDashboard';
import AssignmentsPage from './pages/AssignmentsPage';
import MaterialsPage from './pages/MaterialsPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatPage from './pages/ChatPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ProfilePage from './pages/ProfilePage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5eb6e6',
      dark: '#2a7fae',
      light: '#8ed1f2'
    },
    secondary: {
      main: '#ff9f43',
      dark: '#d47a23',
      light: '#ffc078'
    },
    background: {
      default: '#0a111b',
      paper: '#121b28'
    },
    text: {
      primary: '#e6eef8',
      secondary: '#9db0c8'
    },
    success: {
      main: '#34d399'
    },
    warning: {
      main: '#f59e0b'
    }
  },
  typography: {
    fontFamily: 'Manrope, Outfit, Segoe UI, Tahoma, sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.03em'
    },
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em'
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.03em'
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h6: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 18
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth'
        },
        body: {
          minHeight: '100vh',
          backgroundColor: '#0a111b',
          backgroundImage:
            'radial-gradient(circle at 13% 15%, rgba(94, 182, 230, 0.18) 0, transparent 28%), radial-gradient(circle at 92% 12%, rgba(255, 159, 67, 0.14) 0, transparent 34%), radial-gradient(circle at 50% 110%, rgba(52, 211, 153, 0.1) 0, transparent 24%), linear-gradient(180deg, #0c1420 0%, #070d16 100%)',
          backgroundAttachment: 'fixed',
          color: '#e6eef8'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: '#e6eef8',
          background:
            'linear-gradient(180deg, rgba(18, 27, 40, 0.96) 0%, rgba(13, 21, 33, 0.96) 100%)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.32)',
          borderRadius: 0,
          border: `1px solid ${alpha('#5eb6e6', 0.24)}`,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          overflow: 'hidden'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 72,
          paddingLeft: 'clamp(12px, 2.4vw, 26px)',
          paddingRight: 'clamp(12px, 2.4vw, 26px)',
          gap: 12,
          '@media (max-width:900px)': {
            minHeight: 64,
            rowGap: 8,
            '& .MuiButton-root': {
              paddingInline: 10,
              minWidth: 0
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${alpha('#5eb6e6', 0.16)}`,
          backgroundColor: alpha('#121b28', 0.9),
          backdropFilter: 'blur(10px)',
          boxShadow: '0 14px 30px rgba(0, 0, 0, 0.28)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${alpha('#5eb6e6', 0.14)}`,
          background: 'linear-gradient(180deg, rgba(22, 31, 45, 0.96) 0%, rgba(14, 23, 34, 0.96) 100%)',
          boxShadow: '0 14px 30px rgba(0, 0, 0, 0.32)',
          transition: 'transform 0.24s ease, box-shadow 0.24s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 22px 44px rgba(0, 0, 0, 0.44)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          boxShadow: 'none',
          fontWeight: 700
        },
        containedPrimary: {
          color: '#062033',
          background: 'linear-gradient(120deg, #7fcdf3 0%, #5eb6e6 54%, #3b95c6 100%)',
          boxShadow: '0 10px 24px rgba(57, 146, 196, 0.3)'
        },
        containedSecondary: {
          color: '#2a1700',
          background: 'linear-gradient(120deg, #ffb86b 0%, #ff9f43 100%)',
          boxShadow: '0 10px 22px rgba(245, 158, 11, 0.24)'
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: alpha('#0d1623', 0.86),
          '& fieldset': {
            borderColor: alpha('#5eb6e6', 0.26)
          },
          '&:hover fieldset': {
            borderColor: alpha('#5eb6e6', 0.5)
          },
          '&.Mui-focused fieldset': {
            borderColor: '#7fcdf3',
            borderWidth: 2
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${alpha('#5eb6e6', 0.2)}`
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-selected': {
            backgroundColor: alpha('#5eb6e6', 0.14)
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          border: `1px solid ${alpha('#5eb6e6', 0.2)}`
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#5eb6e6', 0.1)
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '@keyframes fadeLiftIn': {
            from: {
              opacity: 0,
              transform: 'translateY(12px) scale(0.995)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0) scale(1)'
            }
          },
          '@keyframes driftGlow': {
            '0%, 100%': {
              transform: 'translate3d(0, 0, 0) scale(1)'
            },
            '50%': {
              transform: 'translate3d(0, -10px, 0) scale(1.02)'
            }
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#3c6f95 #0c1624'
          },
          '.MuiCard-root, .MuiPaper-root': {
            animation: 'fadeLiftIn 340ms ease'
          },
          'body::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 20% 20%, rgba(94, 182, 230, 0.12) 0, transparent 20%), radial-gradient(circle at 80% 0%, rgba(255, 159, 67, 0.1) 0, transparent 18%)',
            opacity: 1,
            zIndex: -1,
            animation: 'driftGlow 10s ease-in-out infinite'
          },
          '*::-webkit-scrollbar': {
            width: '10px',
            height: '10px'
          },
          '*::-webkit-scrollbar-track': {
            background: '#0c1624'
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #4d88b0 0%, #2f6387 100%)'
          }
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/schedule-class" element={<ScheduleClassPage />} />
          <Route path="/student-classes" element={<StudentClassesPage />} />
          <Route path="/teacher-classes" element={<TeacherClassesPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
