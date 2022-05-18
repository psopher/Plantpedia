import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'

// Import logo image
import logo from '../../images/logo.png'
import philip from '../../images/philip.png'

import { userIsAuthenticated } from '../../helpers/auth'


const pages = ['Add']
const pagesNoLogin = ['Login', 'Register']
const settings = ['Profile', 'Logout']

const PageNavbar  = () => {

  // Navigate
  const navigate = useNavigate()

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleAdd = (event) => {
    console.log('plus clicked')
    setAnchorElNav(event.currentTarget)
  }

  const navigateToSelected = (event) => {
    const pageName = event.currentTarget.innerText.toLowerCase()
    console.log('page to navigate', pageName)

    if (pageName === 'login' || pageName === 'register') {
      navigate(`/${pageName}`)
    } else if (pageName === 'profile') {
      handleCloseUserMenu()
      navigate(`/${pageName}/username`)
    }
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          {/* Logo */}
          <Box as={Link} to="/" sx={{ width: 20, mr: 2 }}>
            <img src={logo} alt="Logo" />
          </Box>

          {userIsAuthenticated() ? 
            <>
              {/* Menu Items */}
              <Box sx={{ flexGrow: 1, justifyContent: 'end', display: 'flex' }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleAdd}
                  color="inherit"
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Profile image */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Philip Sopher" src={philip} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={navigateToSelected}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
            :
            <>
              <Box sx={{ flexGrow: 1, justifyContent: 'end', display: 'flex' }}>
                {pagesNoLogin.map((page, index) => (
                  <Button
                    key={index}
                    onClick={navigateToSelected}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </>
          }
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default PageNavbar