require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const POKEMON = require('./POKEMON.json')
const { NODE_ENV } = require('./config');

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())
app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if(!authToken || apiToken !== authToken.split(' ')[1]){
    res.status(401).json({error: "Bearer Token required"})
  }
  next()
})
app.use((error, req, res, next)=> {
  let response
  if (NODE_ENV === 'production'){
    response = { error : { message: 'server error'}}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

app.get('/pokemon', function handleGetPokemon(req, res){
  let result = POKEMON.pokemon
  if(req.query.name){
  result = result.filter(pokemon =>
    pokemon
      .name
      .toLowerCase()
      .includes(req.query.name.toLowerCase()))
  }
   
 if(req.query.type){
    result = result.filter(pokemon =>
      pokemon
        .type
        .toLowercase()
        .includes(req.query.type)
    )
  }
  return res.json(result)
})

app.get('/types', function handleGetTypes(req, res){
  res.json(validTypes)

}
)

module.exports = app