import App from '@/app';
import IndexRoute from '@routes/index.route';
import ParkingSpotRoute from '@routes/parkingSpot.route';
import ParkingClusterRoute from '@routes/parkingCluster.route';

const app = new App([new IndexRoute(), new ParkingSpotRoute(), new ParkingClusterRoute()]);

app.listen();
