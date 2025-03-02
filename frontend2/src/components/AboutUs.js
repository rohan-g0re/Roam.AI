import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const AboutUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [imageErrors, setImageErrors] = useState({});

  // Team member data
  const teamMembers = [
    {
      name: 'Raunak Choudhary',
      email: 'raunak.choudhary@nyu.edu', // Replace with actual email if available
      image: '/profile_images/Raunak.jpg', // Now using the local image path
      linkedin: 'https://linkedin.com/in/raunak-choudhary', // Replace with actual LinkedIn URL
      github: 'https://github.com/raunak-choudhary', // Replace with actual GitHub URL
    },
    {
      name: 'Rohan Gore',
      email: 'rmg9725@nyu.edu', // Replace with actual email if available
      image: '/profile_images/Rohan.jpeg', // Assuming you'll name the file this way
      linkedin: 'https://www.linkedin.com/in/rohang-atwork/', // Replace with actual LinkedIn URL
      github: 'https://github.com/rohan-g0re', // Replace with actual GitHub URL
    },
    {
      name: 'Sahil Sarnaik',
      email: 'ssarnaik48@gmail.com', // Replace with actual email if available
      image: '/profile_images/Sahil.jpeg', // Assuming you'll name the file this way
      linkedin: 'https://www.linkedin.com/in/sahil-sarnaik-244834299/', // Replace with actual LinkedIn URL
      github: 'https://github.com/sahilms48', // Replace with actual GitHub URL
    },
    {
      name: 'Yashavika Singh',
      email: 'ys6668@nyu.edu', // Replace with actual email if available
      image: '/profile_images/Yashavika.jpeg', // Assuming you'll name the file this way
      linkedin: 'https://www.linkedin.com/in/yashavika-singh-3581b119b/', // Replace with actual LinkedIn URL
      github: 'https://github.com/YashavikaSingh', // Replace with actual GitHub URL
    }
  ];

  return (
    <Box 
      sx={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        pt: 2,
        pb: 4
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          mb: 3
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #03256c 0%, #1768ac 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            About ROAM.AI
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '900px', mx: 'auto', mb: 2 }}>
            ROAM.AI was developed for NYU's Buildathon 2025 - a 36-hour hackathon focused on creating innovative solutions to real-world problems.
          </Typography>

          <Chip 
            label="Buildathon 2025" 
            sx={{ 
              fontSize: '1rem', 
              py: 2, 
              px: 1, 
              backgroundColor: '#1768ac', 
              color: 'white',
              fontWeight: 'bold',
              mb: 3
            }} 
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              color: '#03256c',
              borderLeft: '4px solid #1768ac',
              pl: 2,
              py: 0.5
            }}
          >
            Our Challenge
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>TRACK: The Future of Travel Technology</strong>
          </Typography>
          <Typography variant="body1" paragraph>
            Global business tourism spending reached an estimated $1.357B in 2023, and it's forecast to reach $1.782B in 2027. More than ever, Gen-Z travelers who defy the traditional method of creating travel plans are becoming the main demographic of spenders. With old tools lacking the ability to develop individualized, community-oriented experiences, how do we redefine travel?
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Challenge:</strong> Build an iOS or web-based prototype that pushes the boundaries of travel tech. Go beyond basic AI trip planning — ChatGPT already does this. Think about how you can improve how people interact with travel apps. Consider things like adapting plans on the go, rideshare coordination, and personalized recommendations.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              color: '#03256c',
              borderLeft: '4px solid #1768ac',
              pl: 2,
              py: 0.5
            }}
          >
            Our Solution
          </Typography>
          <Typography variant="body1" paragraph>
            ROAM.AI bridges the gap between travelers and local insights. Unlike conventional travel apps, ROAM.AI focuses on discovering hidden gems and personalized experiences by leveraging a community of local experts and travelers.
          </Typography>
          <Typography variant="body1" paragraph>
            Our key features include:
          </Typography>
          <Box sx={{ pl: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box component="span" sx={{ 
                display: 'inline-block', 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#1768ac', 
                mr: 2 
              }}></Box>
              Community-curated content discovery based on location
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box component="span" sx={{ 
                display: 'inline-block', 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#1768ac', 
                mr: 2 
              }}></Box>
              Voting system that improves recommendation algorithms
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box component="span" sx={{ 
                display: 'inline-block', 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#1768ac', 
                mr: 2 
              }}></Box>
              Dynamic mini-itinerary planning based on available time and interests
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box component="span" sx={{ 
                display: 'inline-block', 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#1768ac', 
                mr: 2 
              }}></Box>
              Showcasing less digitally-visible locations and experiences
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="h5" 
          fontWeight="bold" 
          gutterBottom
          sx={{ 
            color: '#03256c',
            borderLeft: '4px solid #1768ac',
            pl: 2,
            py: 0.5,
            mb: 3
          }}
        >
          Meet Our Team
        </Typography>
        
        <Grid container spacing={isMobile ? 2 : 3}>
            {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                sx={{ 
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
                    }
                }}
                >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                    component="img"
                    height="280"
                    image={imageErrors[member.name] ? `https://via.placeholder.com/300x300?text=${encodeURIComponent(member.name)}` : member.image}
                    alt={member.name}
                    sx={{ objectFit: 'cover' }}
                    onError={() => {
                        setImageErrors(prev => ({
                        ...prev,
                        [member.name]: true
                        }));
                    }}
                    />
                    {/* Transparent overlay with name and email - full image size */}
                    <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': {
                        opacity: 1,
                        }
                    }}
                    >
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 1,
                        textAlign: 'center'
                        }}
                    >
                        {member.name}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{
                        textAlign: 'center'
                        }}
                    >
                        {member.email}
                    </Typography>
                    </Box>
                </Box>
                <CardContent 
                    sx={{ 
                    pb: '16px !important',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3
                    }}
                >
                    <Tooltip 
                    title="LinkedIn" 
                    arrow
                    enterDelay={500}
                    leaveDelay={200}
                    >
                    <IconButton 
                        aria-label="linkedin" 
                        size="small"
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                        color: 'white',
                        bgcolor: '#e3502d',
                        '&:hover': { 
                            bgcolor: '#4CAF50',
                            transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s ease'
                        }}
                    >
                        <LinkedInIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip 
                    title="GitHub" 
                    arrow
                    enterDelay={500}
                    leaveDelay={200}
                    >
                    <IconButton 
                        aria-label="github" 
                        size="small"
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                        color: 'white',
                        bgcolor: '#e3502d',
                        '&:hover': { 
                            bgcolor: '#4CAF50',
                            transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s ease'
                        }}
                    >
                        <GitHubIcon />
                    </IconButton>
                    </Tooltip>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This project was created in collaboration between Tech@NYU, the National Society of Black Engineers (NSBE) NYU Chapter, and the NYU Blockchain Lab.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AboutUs;