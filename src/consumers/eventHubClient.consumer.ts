import { EventHubConsumerClient, latestEventPosition } from '@azure/event-hubs';
import { Server } from 'socket.io';
import { EVENT_HUB_CONNECTION_STRING, EVENT_HUB_NAME } from '@/config';
import { logger } from '@utils/logger';
import ParkingSimulationService from '@services/parkingSimulation.service';
import { ParkingSpotEventDto } from '@dtos/parkingSpotEvent.dto';

const CONSUMER_GROUP = '$Default';

const consumerClient = new EventHubConsumerClient(CONSUMER_GROUP, EVENT_HUB_CONNECTION_STRING, EVENT_HUB_NAME);

export function subscribeToParkingEvents(io: Server) {
  consumerClient.subscribe(
    {
      processEvents: async (events, context) => {
        logger.info(`Received events: ${events.length}`);

        if (events.length === 0) {
          logger.info(`No events received within wait time. Waiting for next interval`);
          return;
        }

        for (const event of events) {
          const parkingEventDto: ParkingSpotEventDto = {
            _id: event.body.Id,
            isOccupied: event.body.IsOccupied,
            time: event.body.Time,
          };
          const parkingSimulationService = new ParkingSimulationService();
          await parkingSimulationService.updateParkingSpot(parkingEventDto);

          io.emit('ps', event.body);
        }

        await context.updateCheckpoint(events[events.length - 1]);
      },

      processError: async (err, context) => {
        logger.error(`Error : ${err}`);
      },
    },
    { startPosition: latestEventPosition },
  );
}
