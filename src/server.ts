import app from "./app";
import env from './environment'

const PORT = env.getPort();
app.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
})