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

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f4c81'
    },
    secondary: {
      main: '#ff7a18'
    },
    background: {
      default: '#f6f8fc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569'
    },
    success: {
      main: '#1f8f5f'
    },
    warning: {
      main: '#dd7a14'
    }
  },
  typography: {
    fontFamily: 'Outfit, Segoe UI, Tahoma, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em'
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
    borderRadius: 14
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundColor: '#f6f8fc',
          backgroundImage:
            'radial-gradient(circle at 14% 18%, rgba(15, 76, 129, 0.12) 0, transparent 34%), radial-gradient(circle at 88% 8%, rgba(255, 122, 24, 0.14) 0, transparent 32%), linear-gradient(180deg, #f8fbff 0%, #eff4fb 100%)',
          backgroundAttachment: 'fixed'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(110deg, #0f4c81 0%, #1f6da8 45%, #0c2b52 100%)',
          boxShadow: '0 10px 28px rgba(15, 76, 129, 0.28)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${alpha('#0f4c81', 0.12)}`
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${alpha('#0f4c81', 0.1)}`,
          boxShadow: '0 8px 24px rgba(15, 76, 129, 0.12)',
          transition: 'transform 0.24s ease, box-shadow 0.24s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 18px 34px rgba(15, 76, 129, 0.2)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18
        },
        containedPrimary: {
          background: 'linear-gradient(120deg, #0f4c81 0%, #1f6da8 100%)'
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
          borderRadius: 12,
          backgroundColor: alpha('#ffffff', 0.88),
          '& fieldset': {
            borderColor: alpha('#0f4c81', 0.22)
          },
          '&:hover fieldset': {
            borderColor: alpha('#0f4c81', 0.45)
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0f4c81',
            borderWidth: 2
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          border: `1px solid ${alpha('#0f4c81', 0.16)}`
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 20px rgba(15, 76, 129, 0.2)'
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
              transform: 'translateY(10px)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#9ab8d5 #eaf1fa'
          },
          '.MuiCard-root, .MuiPaper-root': {
            animation: 'fadeLiftIn 320ms ease'
          },
          '*::-webkit-scrollbar': {
            width: '10px',
            height: '10px'
          },
          '*::-webkit-scrollbar-track': {
            background: '#eaf1fa'
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #7aa9d1 0%, #4d7ca8 100%)'
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
