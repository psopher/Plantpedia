import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getPayload, getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import Spinner from '../utilities/Spinner'

//mui
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

//icon images
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import wateringCan from '../../images/icons/watering-can.png'
import sun from '../../images/icons/sun.png'
import soil from '../../images/icons/soil.png'
import flower from '../../images/icons/flower.png'
import globe from '../../images/icons/globe.png'
import calendar from '../../images/icons/calendar.png'
import emotions from '../../images/icons/emotions.png'
import ruler from '../../images/icons/ruler.png'
import width from '../../images/icons/width.png'

const PlantShow = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const payload = getPayload()
  const token = getTokenFromLocalStorage()

  const [plant, setPlant] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [ loading, setLoading ] = useState(true)

  const [ commentCount, setCommentCount ] = useState()
  const [commentDropdown, setCommentDropdown] = useState('newest')
  const [showComments, setShowComments] = useState(false)
  
  const [formData, setFormData] = useState({
    text: '',
  })

  //get plant data & set initial comments
  useEffect(() => {
    const getPlant = async () => {
      try {
        const { data } = await axios.get(`/api/plants/${id}`)
        setPlant({ ...data, comments: data.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
        setCommentCount(data.comments.length)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    getPlant()
  }, [id])

  // ? Comment Functions

  // comment dropdown menu
  const handleDropdown = (e) => {
    setCommentDropdown(e.target.value)
    if (e.target.value === 'oldest') {
      setPlant({ ...plant, comments: plant.comments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)) })
    } else if (e.target.value === 'newest') {
      setPlant({ ...plant, comments: plant.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
    }
  }

  //input for comment data
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //submit comment
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.text.length) return
    setFormData({ ...formData, owner: payload.sub, username: payload.username })
    try {

      await axios.post(`/api/plants/${plant._id}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      //get new plant comments
      const { data } = await axios.get(`/api/plants/${id}`)

      // update plant data with new comments and sort
      commentDropdown === 'newest' ? setPlant({ ...data, comments: data.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
        : setPlant(data)
      setCommentCount(data.comments.length)
      
      //reset form
      setFormData({
        text: '',
      })

      // hide comment text area
      toggleShowOff()
    } catch (err) {
      console.log(err)
    }
  }

  //unfocus comment section after comment is sent
  const shouldBlur = (e) => {
    if ((e.keyCode === 13)) {
      e.target.blur()
    }
  }

  //show/hide comment buttons
  const toggleShowOn = () => {
    setShowComments(true)
  }

  const toggleShowOff = () => {
    setShowComments(false)
    setFormData({
      text: '',
      owner: '',
    })
  }

  //disable comment button until user has typed message
  const isAddDisabled = formData.text.length === 0

  // ? Favorite Functions

  //update state when user clicks fav icon and on page render
  useEffect(() => {
    const isFavorite = (singlePlant) => {
      if (!payload || !singlePlant) return
      setFavorite(singlePlant.favorites.includes(payload.sub))
    }
    isFavorite(plant)
  }, [plant])

  //send request to favorites
  const toggleFavorite = async (plant) => {
    try {
      await axios.put(`/api/plants/${plant._id}/favorite`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      favorite ? setFavorite(false) : setFavorite(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container maxWidth='lg' >
      {plant ?
        <Container>
          {/* Main Section */}
          <Container sx={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: 2, my: 5, borderRadius: 1 }}>
            <Grid container spacing={2} sx={{ my: 1 }}>
              {/* Title */}
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant='h4'>
                  {plant.name}
                </Typography>
                <Typography variant='subtitle1' fontStyle='italic' sx={{ mt: -1 }}>
                  {plant.scientificName}
                </Typography>
              </Grid>

              {/* Image and Favorite Button */}
              <Grid item md={6} sx={{ textAlign: 'right' }}>
                <Box component='img' src={plant.images} alt={plant.name} sx={{ height: 500, objectFit: 'cover' }} />
                <IconButton
                  sx={{ bottom: 55, right: 5, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(170,170,170,0.5)' }}
                  onClick={() => toggleFavorite(plant)} >
                  {favorite ? <FavoriteIcon sx={{ color: 'red' }}/> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
                </IconButton>
              </Grid>

              {/* Accordion Column */}
              <Grid item md={6} sx={{ textAlign: 'center', flexGrow: 1 }}>
                {/* Description Accordion */}
                <Accordion maxWidth disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="description-content"
                    id="description-header"
                  >
                    <Typography>Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>- Description goes here -</Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Upkeep Accordion */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="upkeep-content"
                    id="upkeep-header"
                    sx={{ backgroundColor: '#8cbf94' }}
                    square='false'
                  >
                    <Typography>Care</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container columnSpacing={1} sx={{ mt: 1 }}>
                      {/* Watering */}
                      <Grid item xs={4}>
                        <Box sx={{ backgroundColor: '#98bac3', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>Watering</Typography>
                          <Box>{plant.ownerUsername.username}</Box>
                          <Chip
                            label={plant.watering}
                            icon={<Box as='img' src={wateringCan} sx={{ width: '24px' }} />}
                            sx={{ width: '120px', mb: 1 }}
                          />
                        </Box>
                      </Grid>
                      {/* Sun Exposure */}
                      <Grid item xs={4}>
                        <Box sx={{ backgroundColor: '#d5cd9f', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>Sun</Typography>
                          <Chip
                            label={plant.sunExposure}
                            icon={<Box as='img' src={sun} sx={{ width: '24px' }} />}
                            variant="filled"
                            sx={{ width: '120px', mb: 1 }}
                          />
                        </Box>
                      </Grid>
                      {/* Soil Type */}
                      <Grid item xs={4}>
                        <Box sx={{ backgroundColor: '#c3ab98', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>Soil Type</Typography>
                          <Chip
                            label={plant.soilType}
                            icon={<Box as='img' src={soil} sx={{ width: '24px' }} />}
                            variant="filled"
                            sx={{ width: '120px', mb: 1 }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Characteristics Accordion */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="characteristics-content"
                    id="characteristics-header"
                  >
                    <Typography>Characteristics</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container rowSpacing={1} columnSpacing={1} sx={{ mt: 1 }}>
                      {/* Lifecycle */}
                      <Grid item xs={3}>
                        <Box sx={{ backgroundColor: '#98bac3', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>
                            Lifecycle
                          </Typography>
                          <Chip
                            label={plant.lifespan}
                            icon={<Box as='img' src={calendar} sx={{ width: '24px' }} />}
                            variant="filled"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      </Grid>
                      {/* Mature Size (Height/Width) */}
                      <Grid item xs={6}>
                        <Box sx={{ backgroundColor: '#d5cd9f', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>Mature Size</Typography>
                          <Chip
                            label={`Length: ${plant.height}"`}
                            icon={<Box as='img' src={ruler} sx={{ width: '24px' }} />}
                            variant="filled"
                            sx={{ mb: 1, mr: '2px' }}
                          />
                          <Chip
                            label={`Width: ${plant.width}"`}
                            icon={<Box as='img' src={width} sx={{ width: '24px' }} />}
                            variant="filled"
                            sx={{ mb: 1, ml: '2px' }}
                          />
                        </Box>
                      </Grid>
                      {/* Mood */}
                      <Grid item xs={3}>
                        <Box sx={{ backgroundColor: '#98bac3', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>
                            Mood
                          </Typography>
                          <Chip
                            label={plant.mood}
                            icon={<Box as='img' src={emotions} sx={{ width: '24px' }} />}
                            variant="filled"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      </Grid>
                      {/* Native Area */}
                      {plant.nativeArea.length ? <Grid item xs={12}>
                        <Box sx={{ backgroundColor: '#c3ab98', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>
                            Native to
                          </Typography>
                          {plant.nativeArea.map((area, i) => {
                            return (
                              <Chip
                                key={i}
                                label={area}
                                icon={<Box as='img' src={globe} sx={{ width: '24px' }} />}
                                variant="filled"
                                sx={{ mb: 1, mr: 1 }}
                              />
                            )
                          })}
                        </Box>
                      </Grid> : null}
                      {/* Flower Color */}
                      {plant.flowerColor.length ? <Grid item xs={12}>
                        <Box sx={{ backgroundColor: '#c3ab98', borderRadius: 10, textAlign: 'center' }}>
                          <Typography>
                            Flower Color
                          </Typography>
                          {plant.flowerColor.map((color, i) => {
                            return (
                              <Chip
                                key={i}
                                label={color}
                                icon={<Box as='img' src={flower} sx={{ width: '24px' }} />}
                                variant="outlined"
                                sx={{ width: '120px', mb: 1, mr: 1, bgcolor: [color], borderColor: 'rgba(0,0,0,0.15)' }}
                              />
                            )
                          })}
                        </Box>
                      </Grid> : null}
                    </Grid>    
                  </AccordionDetails>
                </Accordion>

                {/* Plant Owner */}
                <Typography sx={{ mt: 1 }} >Original Creator: {plant.ownerUsername[0].username}</Typography>
                
                {/* Last Editor */}
                <Typography sx={{ mt: 1 }} >Last Edit: {plant.lastEditUsername[0].username}</Typography>

                {/* Edit Chip */}
                {userIsAuthenticated() ? <Chip
                  label="Edit"
                  onClick={() => navigate(`/plants/${plant._id}/edit`)}
                  icon={<EditRoundedIcon sx={{ width: 15 }} />}
                  variant="outlined"
                  sx={{ float: 'right', mt: 1, bottom: 65 }}
                /> : null}
              </Grid>
            </Grid>
          </Container>
          
          {/* Comment Section */}
          <Container sx={{ backgroundColor: 'rgba(0,0,0,0.05)', height: '100%', p: 5, pt: 5, mb: 5 }}>
            {/* comment info */}
            <Box display='flex' mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.25)', p: 1, px: 2 }}>{commentCount} comments</Typography>

              {/* comment sort select */}
              <Box sx={{ minWidth: 120, mx: 3 }} >
                <FormControl variant='standard' fullWidth size='small'>
                  <InputLabel id="sort-comments">Sort by</InputLabel>
                  <Select
                    labelId="sort-comments"
                    id="sort-comments"
                    value={commentDropdown}
                    label="sort"
                    onChange={handleDropdown}
                    sx={{ p: 'none' }}
                  >
                    <MenuItem value='newest'>Newest</MenuItem>
                    <MenuItem value='oldest'>Oldest</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* add commment */}
            {userIsAuthenticated() ?
              <Stack direction='row' spacing={2}>
                <Avatar sx={{ width: 24, height: 24 }} alt="" src="" />
                <Box width='100%' as='form' onSubmit={handleSubmit}>
                  <TextField
                    name='text'
                    value={formData.text}
                    size='small'
                    variant='standard'
                    fullWidth
                    placeholder='Add comment'
                    autoComplete='off'
                    onChange={handleInput}
                    onKeyUp={shouldBlur}
                    onFocus={toggleShowOn} />
                  {showComments ?
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, float: 'right', display: showComments }}
                        disabled={isAddDisabled}
                      >
                        Add comment
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ mr: 2, mt: 3, float: 'right', display: showComments }}
                        onClick={toggleShowOff}
                      >
                        Cancel
                      </Button>
                    </>
                    : null}

                </Box>
              </Stack> : null}

            {/* comment section */}
            { plant ?
              plant.comments.map(comment => {
                const { username, _id, text, createdAt } = comment
                const date = new Date(createdAt)
                return (
                  <Stack key={_id} direction='row' spacing={2} my={3}>
                    <Avatar sx={{ width: 24, height: 24 }} />
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
                        {username.charAt(0).toUpperCase() + username.slice(1)}
                        <Typography as='span' sx={{
                          ml: 1,
                          fontSize: 10,
                          color: '#9c9c9c',
                        }}>{date.getUTCMonth() + 1}/{date.getUTCDate()}/{date.getUTCFullYear()}
                        </Typography>
                      </Typography>
                      <Typography>
                        {text}
                      </Typography>
                    </Box>
                  </Stack>
                )
              })
              :
              <Box mt={4}>
                No comments!
              </Box>
            }
          </Container>
        </Container>
        :
        <Box sx={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></Box>
      }
    </Container >
  )
}

export default PlantShow