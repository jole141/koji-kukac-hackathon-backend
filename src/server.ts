import App from '@/app';
import IndexRoute from '@routes/index.route';
import ParkingSpotRoute from '@routes/parkingSpot.route';
import ParkingClusterRoute from '@routes/parkingCluster.route';
import AuthRoute from '@routes/auth.route';

const app = new App([new IndexRoute(), new ParkingSpotRoute(), new ParkingClusterRoute(), new AuthRoute()]);

app.listen();
