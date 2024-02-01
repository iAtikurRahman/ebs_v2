//Dependencis
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const connectMongo = require('./config/mongo');
const app = express();
const PORT = process.env.PORT || 3002;

// ------------------------------------middlewares------------------------------//
// Middleware for parsing JSON data
app.use(express.json({ limit: '1gb' }));
app.use(bodyParser.json());
// Auth start
const { isValidRequestFromClient: tokenValidation } = require('./middlewares/clientRequestValidation');
const { ServerAuthorization: serverValidation } = require('./middlewares/serverAuthorization');
// Enable connection reuse to bypass SSL certificate validation issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//import routes here
const eventRoutes = require('./event_all/event/route/eventRoute');
const event_attendeesRoutes = require('./event_all/event_attendees/route/event_attendeesRoute');
const event_collectionRoutes = require('./event_all/event_collection/route/event_collectionRoute');
const event_expenditureRoutes = require('./event_all/event_expenditure/route/event_expenditureRoute');
const event_expenditure_memosRoutes = require('./event_all/event_expenditure_memos/route/event_expenditure_memosRoute');//from mongoDB
const event_locationRoutes = require('./event_all/event_location/route/event_locationRoute');
const event_membersRoutes = require('./event_all/event_members/route/event_membersRoute');
const event_feed_postRoutes = require('./feed_all/event_feed_post/route/event_feed_postRoute');
const event_feed_commentsRoutes = require('./feed_all/event_feed_comments/route/event_feed_commentsRoute');//from mongoDB
const reactionRoutes = require('./feed_all/reactions/route/reactionRoute');//from mongoDB
const poleRoutes = require('./feed_all/pole_all/pole/route/poleRoute');//from mongoDB
const pole_optionRoutes = require('./feed_all/pole_all/pole_opitons/route/pole_optionRoute');//from mongoDB
const pole_responseRoutes = require('./feed_all/pole_all/pole_option_response/route/pole_responseRoute');//from mongoDB



// all routes here
app.use('/api/event',tokenValidation, serverValidation, eventRoutes);
app.use('/api/event_attendees',tokenValidation, serverValidation, event_attendeesRoutes);
app.use('/api/event_collection',tokenValidation, serverValidation, event_collectionRoutes);
app.use('/api/event_expenditure',tokenValidation, serverValidation, event_expenditureRoutes);
app.use('/api/event_expenditure_memos',tokenValidation, serverValidation, event_expenditure_memosRoutes);
app.use('/api/event_location',tokenValidation, serverValidation, event_locationRoutes);
app.use('/api/event_members',tokenValidation, serverValidation, event_membersRoutes);
app.use('/api/event_feed_post',tokenValidation, serverValidation, event_feed_postRoutes);
app.use('/api/event_feed_comments',tokenValidation, serverValidation, event_feed_commentsRoutes);
app.use('/api/reactions',tokenValidation, serverValidation, reactionRoutes);
app.use('/api/pole',tokenValidation, serverValidation, poleRoutes);
app.use('/api/pole_option',tokenValidation, serverValidation, pole_optionRoutes);
app.use('/api/pole_response',tokenValidation, serverValidation, pole_responseRoutes);


app.get('/', (req,res)=>{
    res.send('server is running successfully')
  });
  // health check route
  app.get('/health', (req, res) => {
    res.status(203).json({ message: 'All is Well!' });
  });
  // ERROR: client error handling
  app.use('*', (req, res) => {
    res.status(400).json({ Error: 'Route Not Found' });
  });
  //server running
  app.listen(PORT, async () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
    // MongoDB Database Connection
    await connectMongo();
  });

