# chatbot-interface-using-react-and-express-js-server
## Available Scripts

In the project directory, you can run:

### `npm install`

create .env file and add those two lines :

MONGO_URL = "your mongodb url here"\n
PORT = "your port here"\n
OPENAI_API_KEY= "you open ai api key here"\n 

change the path in saveToJson function in  controllers/question.js to the intents.json file location  


after that run : 

### `npm start`

the server start in port 3001 if you didnt define it in the .env file
